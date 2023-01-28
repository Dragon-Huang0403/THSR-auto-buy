import {
  ArrowBackRounded,
  DirectionsTransitRounded,
  EastRounded,
  KeyboardDoubleArrowRightRounded,
  RouteRounded,
  ScheduleRounded,
} from '@mui/icons-material';
import { Box, IconButton, Link, Typography } from '@mui/material';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { format, subMinutes } from 'date-fns';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import superjson from 'superjson';

import { stationObjects } from '~/src/models/thsr';
import { createContext } from '~/src/server/trpc/context';
import { appRouter } from '~/src/server/trpc/router/_app';
import type { TicketStore } from '~/src/store';
import { useTicketStore } from '~/src/store';
import { CHINESE_DAYS } from '~/src/utils/constants';

export type TimeSearchQuery = Omit<
  TicketStore['searchOptions'],
  'searchDate'
> & {
  searchDate: string;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const query = context.query as TimeSearchQuery;
  const searchDate = new Date(query.searchDate);
  const searchParams = {
    ...query,
    searchDate,
  };

  let timeSearchData = null;
  let errorMessage = null;
  try {
    timeSearchData = await ssg.time.search.fetch(searchParams);
  } catch (e) {
    errorMessage = (e as Error).message;
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      trainItems: timeSearchData?.DepartureTable.TrainItem,
      priceTable: timeSearchData?.PriceTable,
      errorMessage: errorMessage,
      searchOptions: {
        ...query,
        searchDate,
      },
    },
  };
}

const SEARCH_BUFFER_MINUTES = 30;

function SearchPage({
  trainItems,
  errorMessage,
  searchOptions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const dispatch = useTicketStore((state) => state.dispatch);

  const offsetSearchDate = subMinutes(
    searchOptions.searchDate,
    SEARCH_BUFFER_MINUTES,
  );
  const filteredTrainItems = trainItems?.filter((trainItem) => {
    const departureDate = new Date(
      `${trainItem.RunDate} ${trainItem.DepartureTime}`,
    );
    return departureDate >= offsetSearchDate;
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pr: 1,
          py: 1,
          gap: 2,
        }}
      >
        <IconButton
          sx={{ position: 'absolute', left: 0 }}
          LinkComponent={Link}
          href="/time"
        >
          <ArrowBackRounded />
        </IconButton>
        <Typography variant="h5">
          {stationObjects[searchOptions.startStation].name}
        </Typography>
        <KeyboardDoubleArrowRightRounded fontSize="large" />
        <Typography variant="h5">
          {stationObjects[searchOptions.endStation].name}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 2.5 }}>
        {`${format(searchOptions.searchDate, 'yyyy/MM/dd')} (${
          CHINESE_DAYS[searchOptions.searchDate.getDay()]
        })`}
      </Typography>
      {errorMessage && <Typography>{errorMessage}</Typography>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pt: 1,
          px: 2,
          pb: 2,
          overflow: 'auto',
          height: '100%',
        }}
      >
        {filteredTrainItems?.map((trainItem) => {
          const discount = trainItem.Discount.map(
            (item) => `${item.Name} ${item.Value}`,
          ).join('，');

          return (
            <Box
              key={trainItem.TrainNumber}
              sx={{
                bgcolor: (theme) => theme.palette.grey[100],
                borderRadius: 2,
              }}
              onClick={() => {
                dispatch({
                  type: 'bookingOptions',
                  payload: {
                    bookingMethod: 'trainNo',
                    trainNo: trainItem.TrainNumber,
                  },
                });
                dispatch({
                  type: 'searchOptions',
                  payload: {
                    startStation: searchOptions.startStation,
                    endStation: searchOptions.endStation,
                  },
                });
                router.push('/');
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pl: 2,
                  pr: 1.5,
                  pt: 1,
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="h6">
                    {trainItem.DepartureTime}
                  </Typography>
                  <EastRounded />
                  <Typography variant="h6">
                    {trainItem.DestinationTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <ScheduleRounded fontSize="small" />
                  <Typography variant="body2">{trainItem.Duration}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <DirectionsTransitRounded />
                  <Typography>{trainItem.TrainNumber}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: (theme) => `1px solid ${theme.palette.grey[400]}`,
                  px: 1,
                  pt: 0.5,
                  pb: 1,
                  gao: 1,
                }}
              >
                <Typography variant="body2">{discount}</Typography>
                <Typography variant="body2">{trainItem.Note}</Typography>
                <Box
                  sx={{
                    ml: 'auto',
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                >
                  <IconButton sx={{ p: 0 }}>
                    <RouteRounded fontSize="small" />
                  </IconButton>
                  <Typography variant="body2">停靠站</Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

export default SearchPage;
