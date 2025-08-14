import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { getGitHubAuthService } from '@/common/services/github-auth.service';

interface GitHubUserInfo {
  login: string;
  id: number;
  avatar_url?: string;
  name?: string;
  email?: string;
}

export function GitHubAuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [userInfo, setUserInfo] = useState<GitHubUserInfo | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      setStatus('processing');
      
      const authService = getGitHubAuthService();
      const currentUrl = window.location.href;
      
      // Handle authentication callback
      const result = await authService.handleCallback(currentUrl);
      
      setUserInfo(result.user);
      setStatus('success');
      
      // Show success message
      console.log('GitHub authentication successful:', result.user);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      setStatus('error');
      
      console.error('GitHub authentication failed:', err);
    }
  };

  const handleRetry = () => {
    setStatus('processing');
    setError('');
    handleCallback();
  };

  const handleGoBack = () => {
    // Remove authentication parameters from URL
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    // Redirect to GitHub integration page
    window.location.href = '/github';
  };

  if (status === 'processing') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">GitHub Authentication...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing GitHub authentication, please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              <Badge variant="secondary" className="mr-2">✅</Badge>
              Authentication Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {userInfo && (
              <div className="mb-6">
                <img 
                  src={userInfo.avatar_url} 
                  alt={userInfo.login}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
                <h3 className="text-lg font-semibold">{userInfo.name || userInfo.login}</h3>
                <p className="text-gray-600">@{userInfo.login}</p>
                {userInfo.email && (
                  <p className="text-sm text-gray-500">{userInfo.email}</p>
                )}
              </div>
            )}
            
            <p className="text-green-600 mb-4">
              Congratulations! You have successfully connected to your GitHub account
            </p>
            
            <div className="space-y-2">
              <Button onClick={handleGoBack} className="w-full">
                Continue Using App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              <Badge variant="destructive" className="mr-2">❌</Badge>
              Authentication Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <p className="text-red-600 font-medium">An error occurred during authentication:</p>
              <p className="text-sm text-gray-600 mt-2">{error}</p>
            </div>
            
            <div className="space-y-2">
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Retry Authentication
              </Button>
              <Button onClick={handleGoBack} variant="secondary" className="w-full">
                Return to GitHub Page
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>If the problem persists, please check:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Network connection is working</li>
                <li>GitHub service is available</li>
                <li>Application configuration is correct</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
