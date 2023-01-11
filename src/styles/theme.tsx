import type { LinkProps } from '@mui/material';
import { createTheme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';
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

export const theme = createTheme({
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
