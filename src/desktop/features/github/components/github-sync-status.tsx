import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { githubSyncService } from '@/common/services/github-sync.service';
import { useChatStore } from '@/core/stores/chat-store';
import { AlertCircle, Download, RefreshCw, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

export function GitHubSyncStatus() {
    const {
        isGitHubEnabled,
        syncStatus,
        lastSyncTime,
        syncError,
        enableGitHubSync,
        syncToGitHub,
        loadFromGitHub
    } = useChatStore();

    const [isServiceAvailable, setIsServiceAvailable] = useState(false);

    // 检查服务是否可用
    useEffect(() => {
        const checkServiceAvailability = async () => {
            try {
                setIsServiceAvailable(!!githubSyncService);
            } catch {
                setIsServiceAvailable(false);
            }
        };

        checkServiceAvailability();
    }, []);

    // 如果服务不可用，显示配置提示
    if (!isServiceAvailable) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>🔗 GitHub Sync</span>
                        <Badge variant="outline">Not Configured</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        GitHub integration is not configured. Please configure GitHub storage settings first.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                        Configure GitHub First
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const getStatusText = () => {
        switch (syncStatus) {
            case 'syncing':
                return 'Syncing...';
            case 'synced':
                return 'Synced';
            case 'error':
                return 'Error';
            default:
                return 'Idle';
        }
    };

    const getStatusColor = () => {
        switch (syncStatus) {
            case 'syncing':
                return 'secondary';
            case 'synced':
                return 'default';
            case 'error':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatLastSync = (timestamp: string | null) => {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleString();
    };

    if (!isGitHubEnabled) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>🔗 GitHub Sync</span>
                        <Badge variant="outline">Disabled</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        Enable GitHub synchronization to store your chat data in a GitHub repository.
                    </p>
                    <Button onClick={enableGitHubSync} className="w-full">
                        Enable GitHub Sync
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    GitHub Sync Status
                    <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Last Sync:</span>
                            <span className="text-sm text-gray-600">{formatLastSync(lastSyncTime)}</span>
                        </div>
                        {lastSyncTime && (
                            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Refresh
                            </Button>
                        )}
                    </div>

                    {syncError && (
                        <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                            <div className="flex items-center gap-2 text-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Sync Error:</span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">{syncError}</p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={syncToGitHub}
                            disabled={syncStatus === 'syncing'}
                            className="flex-1"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Sync to GitHub
                        </Button>
                        <Button
                            onClick={loadFromGitHub}
                            variant="outline"
                            disabled={syncStatus === 'syncing'}
                            className="flex-1"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Load from GitHub
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
