import { ArrowBackRounded } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import type { RouterInputs } from '~/src/utils/trpc';
import { trpc } from '~/src/utils/trpc';

export type HistorySearchQuery = RouterInputs['ticket']['history'];

function Search() {
  const router = useRouter();
  const query = router.query as HistorySearchQuery;

  const { data: historySearchData, error } = trpc.ticket.history.useQuery(
    query,
    { enabled: router.isReady },
  );
  console.log(historySearchData);

  return (
    <>
      <IconButton
        sx={{ position: 'absolute', left: 0 }}
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackRounded />
      </IconButton>
      {error && <Typography>{error.message}</Typography>}
    </>
  );
}

export default Search;
