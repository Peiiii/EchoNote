import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { useGitHubConfigStore, GitHubUserInfo } from '@/core/stores/github-config.store';
import { useCallback, useEffect, useState } from 'react';

interface DebugInfo {
  authInfo: unknown;
  isAuthenticated: boolean;
  hasAccessToken: boolean;
  accessTokenLength: number;
  accessTokenPreview: string;
  userInfo: GitHubUserInfo | null;
  storageConfig: unknown;
  timestamp: string;
  error?: string;
}

export function GitHubDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get store state
  const { 
    authInfo, 
    userInfo, 
    isAuthenticated, 
    storageConfig,
    clearAuthInfo 
  } = useGitHubConfigStore();

  const updateDebugInfo = useCallback(() => {
    try {
      const accessToken = authInfo?.accessToken;
      
      setDebugInfo({
        authInfo,
        isAuthenticated,
        hasAccessToken: !!accessToken,
        accessTokenLength: accessToken ? accessToken.length : 0,
        accessTokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : 'None',
        userInfo,
        storageConfig,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setDebugInfo({
        authInfo: null,
        isAuthenticated: false,
        hasAccessToken: false,
        accessTokenLength: 0,
        accessTokenPreview: 'None',
        userInfo: null,
        storageConfig: null,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [authInfo, userInfo, isAuthenticated, storageConfig]);

  useEffect(() => {
    updateDebugInfo();
  }, [updateDebugInfo]);

  const handleClearAuth = () => {
    try {
      clearAuthInfo();
      updateDebugInfo();
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  if (!debugInfo) {
    return <div>Loading debug info...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🔍 GitHub Debug Information</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={updateDebugInfo}>
              Refresh
            </Button>
            <Button size="sm" variant="destructive" onClick={handleClearAuth}>
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
                <p>Login: {debugInfo.userInfo?.login || 'N/A'}</p>
                <p>ID: {debugInfo.userInfo?.id || 'N/A'}</p>
                <p>Name: {debugInfo.userInfo?.name || 'N/A'}</p>
                <p>Email: {debugInfo.userInfo?.email || 'N/A'}</p>
                {debugInfo.userInfo?.avatar_url && (
                  <p>Avatar: Available</p>
                )}
              </div>
            </div>
          )}

          {isExpanded && (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Storage Config:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.storageConfig, null, 2)}
                </pre>
              </div>
              <div>
                <span className="font-medium">User Info:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.userInfo, null, 2)}
                </pre>
              </div>
              <div>
                <span className="font-medium">Full Auth Info:</span>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(debugInfo.authInfo, null, 2)}
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
