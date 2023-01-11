import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import {
  Box,
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
import React from 'react';
import superjson from 'superjson';

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

function SearchPage({
  timeSearchData,
  errorMessage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <IconButton
        sx={{ alignSelf: 'flex-start' }}
        LinkComponent={Link}
        href="/time"
      >
        <ArrowBackOutlinedIcon />
      </IconButton>
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
              {timeSearchData.TrainItem.map((row) => {
                const discount = row.Discount.map(
                  (item) => `${item.Name} ${item.Value}`,
                ).join(', ');
                const paddingStyle =
                  discount || row.Note ? { paddingBottom: 30 } : {};
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    key={row.TrainNumber}
                    sx={{ position: 'relative' }}
                  >
                    <TableCell
                      align="center"
                      sx={{ position: 'relative' }}
                      style={paddingStyle}
                    >
                      {row[columns[0].key]}
                      <Box
                        sx={{
                          position: 'absolute',
                          pl: 2,
                          pt: 0.5,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {discount && (
                          <Typography variant="body2">{discount}</Typography>
                        )}
                        {row.Note && (
                          <Typography variant="body2">{row.Note}</Typography>
                        )}
                      </Box>
                    </TableCell>
                    {columns.slice(1).map((column) => (
                      <TableCell
                        key={column.key}
                        align="center"
                        style={paddingStyle}
                      >
                        {row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default SearchPage;
