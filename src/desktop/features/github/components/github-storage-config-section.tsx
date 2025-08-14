import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { GitHubStorageConfig } from '@/core/stores/github-config.store';

interface GitHubStorageConfigSectionProps {
  storageConfig: GitHubStorageConfig;
  isStorageConfigured: boolean;
  onStorageConfigChange: (config: Partial<GitHubStorageConfig>) => void;
  onResetConfig: () => void;
}

export function GitHubStorageConfigSection({
  storageConfig,
  isStorageConfigured,
  onStorageConfigChange,
  onResetConfig
}: GitHubStorageConfigSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">⚙️</Badge>
          Storage Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isStorageConfigured ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Configure where your data will be stored in GitHub:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Repository Owner</label>
                <Input
                  placeholder="Your GitHub username"
                  value={storageConfig.owner}
                  onChange={(e) => onStorageConfigChange({ owner: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Repository Name</label>
                <Input
                  placeholder="Repository name"
                  value={storageConfig.repo}
                  onChange={(e) => onStorageConfigChange({ repo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <Input
                  placeholder="main"
                  value={storageConfig.branch}
                  onChange={(e) => onStorageConfigChange({ branch: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Base Path</label>
                <Input
                  placeholder="data"
                  value={storageConfig.basePath}
                  onChange={(e) => onStorageConfigChange({ basePath: e.target.value })}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>• Repository Owner: Your GitHub username or organization name</p>
              <p>• Repository Name: The repository where data will be stored</p>
              <p>• Branch: The branch to use (usually 'main' or 'master')</p>
              <p>• Base Path: Subfolder within the repository (e.g., 'data', 'notes')</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Repository Owner:</span>
              <span className="ml-2 text-gray-600">{storageConfig.owner}</span>
            </div>
            <div>
              <span className="font-medium">Repository Name:</span>
              <span className="ml-2 text-gray-600">{storageConfig.repo}</span>
            </div>
            <div>
              <span className="font-medium">Branch:</span>
              <span className="ml-2 text-gray-600">{storageConfig.branch}</span>
            </div>
            <div>
              <span className="font-medium">Base Path:</span>
              <span className="ml-2 text-gray-600">{storageConfig.basePath}</span>
            </div>
            <div className="col-span-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onResetConfig}
              >
                Change Configuration
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
