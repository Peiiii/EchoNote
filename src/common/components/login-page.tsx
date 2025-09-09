import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { useAuthStore } from '@/core/stores/auth.store';
import { LogIn, MessageSquare } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithGoogle, isAuthenticating } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Welcome to EchoNote
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
              Your personal note-taking and chat companion
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sign in to access your notes and continue your conversations
            </p>
          </div>
          
          <Button
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            {isAuthenticating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                <span>Sign in with Google</span>
              </div>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
