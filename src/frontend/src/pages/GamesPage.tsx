import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Gamepad2, Dices, Trophy, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export default function GamesPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Show access denied for unauthenticated users or non-admins
  if (!isAuthenticated && !isInitializing) {
    return <AccessDeniedScreen />;
  }

  // Show loading state while initializing or checking admin status
  if (isInitializing || adminCheckLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-betika-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isInitializing ? 'Loading...' : 'Verifying admin access...'}
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if authenticated but not admin
  if (isAuthenticated && !isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Games Management</h1>
              <p className="text-muted-foreground">Manage casino games and betting options</p>
            </div>
            <Link to="/admin">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active games</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bets</CardTitle>
              <Dices className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-betika-green">0</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh 0</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-betika-green" />
              Games Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">Games Management Coming Soon</p>
              <p className="text-sm">
                This section will allow you to create, edit, and manage casino games.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Betika Casino. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-betika-green hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
