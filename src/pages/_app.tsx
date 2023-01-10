import { CssBaseline, ThemeProvider } from '@mui/material';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { type AppType } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

import { theme } from '~/src/styles/theme';

import { trpc } from '../utils/trpc';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
