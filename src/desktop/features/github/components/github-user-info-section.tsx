import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

interface GitHubUserInfo {
  login: string;
  id: number;
  avatar_url?: string;
  name?: string;
  email?: string;
}

interface GitHubUserInfoSectionProps {
  userInfo: GitHubUserInfo;
  onLogout: () => void;
}

export function GitHubUserInfoSection({ userInfo, onLogout }: GitHubUserInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">👤</Badge>
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={userInfo?.avatar_url}
              alt={userInfo?.login}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{userInfo?.name || userInfo?.login}</p>
              <p className="text-sm text-gray-600">@{userInfo?.login}</p>
              {userInfo?.email && (
                <p className="text-xs text-gray-500">{userInfo.email}</p>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
