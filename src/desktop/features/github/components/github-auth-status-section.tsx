import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Badge } from '@/common/components/ui/badge';
import { useGitHubConfigStore } from '@/core/stores/github-config.store';
import { Github, LogOut, User, Shield } from 'lucide-react';

export function GitHubAuthStatusSection() {
  const { 
    isAuthenticated, 
    userInfo, 
    authInfo,
    clearAuthInfo 
  } = useGitHubConfigStore();

  const handleLogin = () => {
    // 重定向到 GitHub OAuth
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/github-callback`;
    const scope = 'repo';
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    // 存储 state 用于验证回调
    sessionStorage.setItem('github_oauth_state', state);
    
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    clearAuthInfo();
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Authentication
            <Badge variant="outline" className="ml-auto">Not Authenticated</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your GitHub account to enable data storage and synchronization.
            </p>
            <Button onClick={handleLogin} className="w-full">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub Account
            </Button>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Requires repository access permissions</p>
              <p>• Your data will be stored in your GitHub repository</p>
              <p>• You can revoke access at any time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          GitHub Authentication
          <Badge variant="default" className="ml-auto bg-green-600">Authenticated</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userInfo && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {userInfo.avatar_url ? (
                <img 
                  src={userInfo.avatar_url} 
                  alt={userInfo.name || userInfo.login}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
              <div className="flex-1">
                <p className="font-medium">{userInfo.name || userInfo.login}</p>
                <p className="text-sm text-gray-600">@{userInfo.login}</p>
                {userInfo.email && (
                  <p className="text-xs text-gray-500">{userInfo.email}</p>
                )}
              </div>
            </div>
          )}
          
          {authInfo && (
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Token Type:</span>
                <span className="font-mono">{authInfo.tokenType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scope:</span>
                <span className="font-mono">{authInfo.scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-mono">
                  {new Date(authInfo.createdAt + authInfo.expiresIn * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
          
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect GitHub
          </Button>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ Successfully connected to GitHub</p>
            <p>✓ Repository access granted</p>
            <p>✓ Ready for data synchronization</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
