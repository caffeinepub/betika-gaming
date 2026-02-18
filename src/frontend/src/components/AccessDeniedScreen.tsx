import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Loader2, Sparkles } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-betika-green/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto mb-2 relative">
            <div className="absolute inset-0 bg-betika-green/20 blur-2xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-betika-green to-betika-green-dark p-6 rounded-2xl w-fit mx-auto">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Welcome to Betika Casino</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your admin dashboard and manage your casino operations
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-betika-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Secure Authentication</p>
                <p className="text-xs text-muted-foreground">
                  Your identity is protected with Internet Identity technology
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-betika-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Manage Fund Releases</p>
                <p className="text-xs text-muted-foreground">
                  Process payouts and track transaction history
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-betika-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Real-time Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  Monitor pending payouts and account balances
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full bg-betika-green hover:bg-betika-green-dark text-white font-semibold text-base h-12"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Sign In Securely
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
