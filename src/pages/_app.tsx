import { CssBaseline, ThemeProvider } from '@mui/material';
import { type AppType } from 'next/app';

import { theme } from '~/src/styles/theme';

import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
