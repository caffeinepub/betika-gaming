import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetReleaseHistory } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import AdminFundsReleaseSection from '../components/AdminFundsReleaseSection';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Wallet, TrendingUp, History } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import DataTable from '../components/DataTable';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: releaseHistory, isLoading: historyLoading } = useGetReleaseHistory();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Show access denied for unauthenticated users or non-admins
  if (!isAuthenticated || (!adminCheckLoading && !isAdmin)) {
    return <AccessDeniedScreen />;
  }

  // Show loading state while checking admin status
  if (adminCheckLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-betika-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'username', label: 'User' },
    {
      key: 'amount',
      label: 'Amount (KSh)',
      format: (val: bigint) => (
        <span className="text-betika-green font-medium">
          {Number(val).toLocaleString()}
        </span>
      ),
    },
    { key: 'releaseDate', label: 'Release Date' },
    {
      key: 'status',
      label: 'Status',
      format: (val: string) => (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-betika-green/10 text-betika-green">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/profile' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage fund releases and payouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holding Account</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0116828013</div>
              <p className="text-xs text-muted-foreground">M-PESA Paybill 290290</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-betika-green">
                {releaseHistory ? releaseHistory.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting release</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Released</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {releaseHistory ? releaseHistory.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payouts Section */}
        <div className="mb-8">
          <AdminFundsReleaseSection />
        </div>

        {/* Release History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-betika-green" />
              Release History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-betika-green"></div>
              </div>
            ) : !releaseHistory || releaseHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No release history available
              </div>
            ) : (
              <DataTable data={releaseHistory} columns={columns} />
            )}
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
