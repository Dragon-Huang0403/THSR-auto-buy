import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type AppType } from 'next/app';

import { getLayout } from '~/src/layouts/Layout';
import { theme } from '~/src/styles/theme';

import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {getLayout(<Component {...pageProps} />)}
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
