import { Box, Link } from '@mui/material';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Box>
        <Link href="/">Reserve</Link>
        <Link href="/search">Search</Link>
      </Box>
      {children}
    </Box>
  );
}

export const getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
