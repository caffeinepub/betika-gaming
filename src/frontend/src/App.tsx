import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import AdminPage from './pages/AdminPage';
import GamesPage from './pages/GamesPage';
import { Toaster } from './components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LoginButton from './components/LoginButton';
import UserMenu from './components/UserMenu';

function Layout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-betika-green to-betika-green-dark flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Betika Casino</h1>
                  <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isAuthenticated ? <UserMenu /> : <LoginButton />}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AdminPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesPage,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute, gamesRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
