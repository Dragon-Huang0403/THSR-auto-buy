import type { LinkProps } from '@mui/material';
import { createTheme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { Roboto } from '@next/font/google';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import React from 'react';

/**
 * @reference https://github.com/mui/material-ui/issues/31289#issuecomment-1062874372
 */
const LinkBehavior = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  (props, ref) => {
    const { href, ...other } = props;
    return <NextLink ref={ref} href={href} {...other} />;
  },
);
LinkBehavior.displayName = 'Link';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
  },
});
