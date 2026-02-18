import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isLoading = isInitializing || isLoggingIn;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoading}
      size="lg"
      className="bg-betika-green hover:bg-betika-green-dark text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse hover:animate-none"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {isInitializing ? 'Loading...' : 'Authenticating...'}
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-5 w-5" />
          Sign In to Play
        </>
      )}
    </Button>
  );
}
