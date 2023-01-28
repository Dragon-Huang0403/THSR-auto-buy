import { AppBar, Box, Container, Link, Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const routes = [
  { href: '/time', name: '時刻表' },
  {
    href: '/',
    name: '預約訂票',
  },
  { href: '/history', name: '訂票查詢' },
];
export function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter();

  const secondSlashIndex = [...pathname.matchAll(/\//g)][1]?.index;
  const value = secondSlashIndex
    ? pathname.slice(0, secondSlashIndex)
    : pathname;

  return (
    <Container disableGutters sx={{ pt: 6, height: '100vh' }}>
      <AppBar>
        <Tabs
          centered
          variant="fullWidth"
          value={value}
          indicatorColor="secondary"
          textColor="inherit"
        >
          {routes.map((route) => (
            <Tab
              label={route.name}
              key={route.name}
              href={route.href}
              value={route.href}
              LinkComponent={Link}
            />
          ))}
        </Tabs>
      </AppBar>
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export const getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
