import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Shield, Loader2, Sparkles, Lock } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, loginStatus, isInitializing } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';
  const isLoading = isInitializing || isLoggingIn;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-betika-green/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Inline Authentication Banner */}
        <Alert className="border-2 border-betika-green/20 bg-card shadow-2xl mb-6">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-betika-green/20 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-betika-green to-betika-green-dark p-4 rounded-xl">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <AlertTitle className="text-2xl font-bold mb-2">
                  Sign In Required
                </AlertTitle>
                <AlertDescription className="text-base text-muted-foreground">
                  Access your admin dashboard to manage casino operations, process payouts, and track transactions.
                </AlertDescription>
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                size="lg"
                className="w-full sm:w-auto bg-betika-green hover:bg-betika-green-dark text-white font-semibold text-base h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isInitializing ? 'Loading...' : 'Connecting...'}
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Sign In Securely
                  </>
                )}
              </Button>
            </div>
          </div>
        </Alert>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-betika-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">Secure Authentication</p>
                <p className="text-xs text-muted-foreground">
                  Protected with Internet Identity technology
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-betika-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">Manage Payouts</p>
                <p className="text-xs text-muted-foreground">
                  Process fund releases and track history
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-betika-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">Real-time Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  Monitor operations and balances
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}
