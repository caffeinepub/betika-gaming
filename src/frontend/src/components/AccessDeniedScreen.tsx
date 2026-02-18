import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, Loader2 } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-betika-green/10 p-4 rounded-full w-fit">
            <Lock className="h-12 w-12 text-betika-green" />
          </div>
          <CardTitle className="text-2xl">Access Restricted</CardTitle>
          <CardDescription>
            You need to be logged in to view your profile. Please authenticate to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-betika-green hover:bg-betika-green-dark"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login with Internet Identity'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
