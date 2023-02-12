import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, NoSsr, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { AppProps } from 'next/app';

import { getLayout } from '~/src/layouts/Layout';
import { theme } from '~/src/styles/theme';

import createEmotionCache from '../utils/createEmotionCache';
import { trpc } from '../utils/trpc';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <NoSsr>{getLayout(<Component {...pageProps} />)}</NoSsr>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default trpc.withTRPC(MyApp);
