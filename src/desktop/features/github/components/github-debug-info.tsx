import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { getGitHubAuthService } from '@/common/services/github-auth.service';
import { useEffect, useState } from 'react';

interface DebugInfo {
  authStatus: unknown;
  isAuthenticated: boolean;
  hasAccessToken: boolean;
  accessTokenLength: number;
  accessTokenPreview: string;
  userInfo: unknown;
  localStorageData: unknown;
  sessionStorageData: string | null;
  timestamp: string;
  error?: string;
}

export function GitHubDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    updateDebugInfo();
  }, []);

  const updateDebugInfo = () => {
    try {
      const authService = getGitHubAuthService();
      const authStatus = authService.getAuthStatus();
      const isAuth = authService.isAuthenticated();
      const accessToken = authService.getAccessToken();
      const userInfo = authService.getUserInfo();

      // Check localStorage directly
      const localStorageData = localStorage.getItem('github_auth');
      const sessionStorageData = sessionStorage.getItem('github_auth_state');

      setDebugInfo({
        authStatus,
        isAuthenticated: isAuth,
        hasAccessToken: !!accessToken,
        accessTokenLength: accessToken ? accessToken.length : 0,
        accessTokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'None',
        userInfo,
        localStorageData: localStorageData ? JSON.parse(localStorageData) : null,
        sessionStorageData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setDebugInfo({
        authStatus: null,
        isAuthenticated: false,
        hasAccessToken: false,
        accessTokenLength: 0,
        accessTokenPreview: 'None',
        userInfo: null,
        localStorageData: null,
        sessionStorageData: null,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const clearAuth = () => {
    try {
      const authService = getGitHubAuthService();
      authService.logout();
      updateDebugInfo();
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  if (!debugInfo) {
    return <div>Loading debug info...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔍 GitHub Debug Information</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={updateDebugInfo}>
              Refresh
            </Button>
            <Button size="sm" variant="destructive" onClick={clearAuth}>
              Clear Auth
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Authentication Status:</span>
              <Badge variant={debugInfo.isAuthenticated ? "secondary" : "destructive"} className="ml-2">
                {debugInfo.isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Access Token:</span>
              <Badge variant={debugInfo.hasAccessToken ? "secondary" : "destructive"} className="ml-2">
                {debugInfo.hasAccessToken ? "✅ Present" : "❌ Missing"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Token Length:</span>
              <span className="ml-2">{debugInfo.accessTokenLength}</span>
            </div>
            <div>
              <span className="font-medium">Token Preview:</span>
              <span className="ml-2 font-mono text-xs">{debugInfo.accessTokenPreview}</span>
            </div>
          </div>

          {Boolean(debugInfo.userInfo) && (
            <div>
              <span className="font-medium">User Info:</span>
              <div className="ml-2 text-sm">
                <p>Login: Available</p>
                <p>ID: Available</p>
                <p>Name: Available</p>
              </div>
            </div>
          )}

          {isExpanded && (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Local Storage Data:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.localStorageData, null, 2)}
                </pre>
              </div>
              <div>
                <span className="font-medium">Session Storage Data:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.sessionStorageData, null, 2)}
                </pre>
              </div>
              <div>
                <span className="font-medium">Full Auth Status:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.authStatus, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Last updated: {debugInfo.timestamp}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
