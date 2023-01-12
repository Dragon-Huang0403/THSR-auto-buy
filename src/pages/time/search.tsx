import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DirectionsTransitRoundedIcon from '@mui/icons-material/DirectionsTransitRounded';
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { Box, IconButton, Link, Typography } from '@mui/material';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import React from 'react';
import superjson from 'superjson';

import { createContext } from '~/src/server/trpc/context';
import { appRouter } from '~/src/server/trpc/router/_app';
import type { RouterInputs } from '~/src/utils/trpc';

export type SearchPageQuery = Omit<
  RouterInputs['time']['search'],
  'OutWardSearchDate'
> & { OutWardSearchDate: string };

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const query = context.query as SearchPageQuery;

  const searchParams = {
    ...query,
    OutWardSearchDate: new Date(query.OutWardSearchDate as string),
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
      timeSearchData,
      errorMessage: errorMessage,
    },
  };
}

function SearchPage({
  timeSearchData,
  errorMessage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h5">
          {timeSearchData?.Title.StartStationName}
        </Typography>
        <KeyboardDoubleArrowRightRoundedIcon fontSize="large" />
        <Typography variant="h5">
          {timeSearchData?.Title.EndStationName}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 2.5 }}>
        {timeSearchData?.Title.TitleSplit2}
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
        {timeSearchData &&
          timeSearchData.TrainItem.map((trainItem) => {
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
                    <EastRoundedIcon />
                    <Typography variant="h6">
                      {trainItem.DestinationTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <ScheduleRoundedIcon fontSize="small" />
                    <Typography variant="body2">
                      {trainItem.Duration}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <DirectionsTransitRoundedIcon />
                    <Typography>{trainItem.TrainNumber}</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: (theme) =>
                      `1px solid ${theme.palette.grey[400]}`,
                    pl: 2,
                    px: 1.5,
                    pt: 0.5,
                    pb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {discount}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      alignItems: 'center',
                    }}
                  >
                    <IconButton sx={{ p: 0 }}>
                      <RouteRoundedIcon fontSize="small" />
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
