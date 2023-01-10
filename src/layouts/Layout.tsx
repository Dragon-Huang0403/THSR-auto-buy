import { AppBar, Container, Link, Tab, Tabs } from '@mui/material';
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
  { href: '/history', name: '預約查詢' },
];
export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <Container disableGutters>
      <AppBar position="static">
        <Tabs
          centered
          variant="fullWidth"
          value={router.pathname}
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
      {children}
    </Container>
  );
}

export const getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
