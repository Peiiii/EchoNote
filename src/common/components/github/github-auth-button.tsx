import React, { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { getGitHubAuthService } from "@/common/services/github-auth.service";

interface GitHubAuthButtonProps {
  onAuthStart?: () => void;
  onAuthSuccess?: (userInfo: Record<string, unknown>) => void;
  onAuthError?: (error: string) => void;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function GitHubAuthButton({
  onAuthStart,
  onAuthError,
  variant = "default",
  size = "default",
  children,
}: GitHubAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setIsLoading(true);

      // 调用开始认证回调
      if (onAuthStart) {
        onAuthStart();
      }

      const authService = getGitHubAuthService();

      // 启动认证流程
      const authUrl = await authService.startAuth();

      // 重定向到GitHub授权页面
      window.location.href = authUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "启动认证失败";
      console.error("GitHub认证启动失败:", error);

      // 调用错误回调
      if (onAuthError) {
        onAuthError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoading}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 4.624-5.479 4.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )}
      {children || (isLoading ? "Authenticating..." : "Connect GitHub")}
    </Button>
  );
}

// 认证状态显示组件
interface GitHubUserInfo {
  login: string;
  id: number;
  avatar_url?: string;
  name?: string;
  email?: string;
}

export function GitHubAuthStatus() {
  const [userInfo, setUserInfo] = useState<GitHubUserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    try {
      const authService = getGitHubAuthService();
      const auth = authService.getAuthStatus();

      if (auth) {
        setUserInfo(auth.user as unknown as GitHubUserInfo);
        setIsAuthenticated(true);
      }
    } catch {
      // Service not initialized, ignore error
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">🔒</Badge>
            GitHub Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You haven't connected to your GitHub account yet. After connecting, you can sync data to
            GitHub repositories.
          </p>
          <GitHubAuthButton>Connect GitHub</GitHubAuthButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">✅</Badge>
          GitHub Connected
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userInfo && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src={userInfo.avatar_url}
              alt={userInfo.login}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{userInfo.name || userInfo.login}</p>
              <p className="text-sm text-gray-600">@{userInfo.login}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Manage Repositories
          </Button>
          <Button variant="destructive" size="sm" className="w-full">
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
