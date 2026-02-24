import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import CarCustomizer from './pages/CarCustomizer';
import LandingPage from './pages/LandingPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const customizerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customize',
  component: CarCustomizer,
});

const routeTree = rootRoute.addChildren([indexRoute, customizerRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'oklch(0.16 0 0)',
            border: '1px solid oklch(0.28 0 0)',
            color: 'oklch(0.95 0 0)',
          },
        }}
      />
    </ThemeProvider>
  );
}
