import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import {
  Box,
  Collapse,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import React, { useReducer } from 'react';
import superjson from 'superjson';

import type { TrainItem } from '~/src/models/thsr';
import { createContext } from '~/src/server/trpc/context';
import { appRouter } from '~/src/server/trpc/router/_app';
import type { RouterInputs } from '~/src/utils/trpc';

const columns = [
  {
    label: '出發時間',
    key: 'DepartureTime',
  },
  {
    label: '到達時間',
    key: 'DestinationTime',
  },
  {
    label: '行車時間',
    key: 'Duration',
  },
  {
    label: '車次',
    key: 'TrainNumber',
  },
] as const;

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

type SearchTableRowProps = {
  trainItem: TrainItem;
};

function SearchTableRow({ trainItem }: SearchTableRowProps) {
  const [isStationInfoOpen, toggleIsStationInfoOpen] = useReducer(
    (prev) => !prev,
    false,
  );

  const discount = trainItem.Discount.map(
    (item) => `${item.Name} ${item.Value}`,
  ).join('，');
  const paddingStyle = discount || trainItem.Note ? { paddingBottom: 30 } : {};

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        sx={{ position: 'relative' }}
        component={Box}
        onClick={toggleIsStationInfoOpen}
      >
        <TableCell
          align="center"
          sx={{ position: 'relative' }}
          style={paddingStyle}
        >
          {trainItem[columns[0].key]}
          <Box
            sx={{
              position: 'absolute',
              pl: 2,
              pt: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {discount && <Typography variant="body2">{discount}</Typography>}
            {trainItem.Note && (
              <Typography variant="body2">{trainItem.Note}</Typography>
            )}
          </Box>
        </TableCell>
        {columns.slice(1).map((column) => (
          <TableCell key={column.key} align="center" style={paddingStyle}>
            {trainItem[column.key]}
          </TableCell>
        ))}
      </TableRow>
      <TableCell
        style={{ paddingBottom: 0, paddingTop: 0 }}
        colSpan={columns.length}
      >
        <Collapse in={isStationInfoOpen} timeout="auto" unmountOnExit>
          <Box sx={{ m: 1, display: 'flex' }}>
            {trainItem.StationInfo.map(
              (station) =>
                station.Show && (
                  <Box key={station.StationNo}>{station.StationName}</Box>
                ),
            )}
          </Box>
        </Collapse>
      </TableCell>
    </>
  );
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
          gap: 1,
        }}
      >
        <IconButton
          sx={{ position: 'absolute', left: 0 }}
          LinkComponent={Link}
          href="/time"
        >
          <ArrowBackOutlinedIcon />
        </IconButton>
        <Typography>{timeSearchData?.Title.StartStationName}</Typography>
        <DoubleArrowIcon />
        <Typography>{timeSearchData?.Title.EndStationName}</Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 2 }}>
        {timeSearchData?.Title.TitleSplit2}
      </Typography>
      {errorMessage && <Typography>{errorMessage}</Typography>}
      {timeSearchData && (
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.label} align="center">
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSearchData.TrainItem.map((trainItem) => (
                <SearchTableRow
                  trainItem={trainItem}
                  key={trainItem.TrainNumber}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default SearchPage;
