import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { type AppType } from 'next/app';

import { LifeCycleProvider } from '~/src/features/lifeCycleMachine';
import { getLayout } from '~/src/layouts/Layout';
import { theme } from '~/src/styles/theme';

import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <LifeCycleProvider>
            {getLayout(<Component {...pageProps} />)}
          </LifeCycleProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
