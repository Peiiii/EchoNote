import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { useGitHubSyncStore } from "@/core/stores/github-sync.store";
import { useGitHubConfigStore } from "@/core/stores/github-config.store";
import { Upload, Download, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

export function QuickSyncSection() {
  const { isGitHubEnabled, syncStatus, lastSyncTime, syncError, syncToGitHub, loadFromGitHub } =
    useGitHubSyncStore();

  const { isAuthenticated, isStorageConfigured } = useGitHubConfigStore();
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  console.log("[QuickSyncSection] syncStatus", {
    syncStatus,
    isGitHubEnabled,
    isAuthenticated,
    isStorageConfigured,
  });

  console.log("[QuickSyncSection] isGitHubEnabled", {
    isGitHubEnabled,
    isAuthenticated,
    isStorageConfigured,
  });

  const handleSyncToGitHub = async () => {
    if (!isGitHubEnabled) return;

    setIsManualSyncing(true);
    try {
      await syncToGitHub();
    } finally {
      setIsManualSyncing(false);
    }
  };

  const handleLoadFromGitHub = async () => {
    if (!isGitHubEnabled) return;

    setIsManualSyncing(true);
    try {
      await loadFromGitHub();
    } finally {
      setIsManualSyncing(false);
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />;
      case "synced":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing...";
      case "synced":
        return "Synced";
      case "error":
        return "Error";
      default:
        return "Idle";
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "syncing":
        return "secondary";
      case "synced":
        return "default";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  // 如果GitHub未配置，显示配置提示
  if (!isAuthenticated || !isStorageConfigured()) {
    return (
      <Card className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Upload className="h-6 w-6" />
            Quick Sync - Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Complete GitHub authentication and storage configuration to enable data synchronization.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Sync to GitHub
            </Button>
            <Button variant="outline" disabled>
              Load from GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 如果GitHub同步未启用，显示启用提示
  if (!isGitHubEnabled) {
    return (
      <Card className="w-full border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Upload className="h-6 w-6" />
            Quick Sync - Ready to Enable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            GitHub integration is configured. Enable synchronization to start syncing your data.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Sync to GitHub
            </Button>
            <Button variant="outline" disabled>
              Load from GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 显示完整的快速同步功能
  return (
    <Card className="w-full border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Upload className="h-6 w-6" />
          Quick Sync - Ready
          <Badge variant={getStatusColor()} className="ml-auto">
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 同步状态信息 */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Last Sync:</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatLastSync(lastSyncTime)}
            </span>
          </div>
          {lastSyncTime && (
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          )}
        </div>

        {/* 错误信息显示 */}
        {syncError && (
          <div className="p-3 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Sync Error:</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{syncError}</p>
          </div>
        )}

        {/* 手动同步按钮 */}
        <div className="flex gap-3">
          <Button
            onClick={handleSyncToGitHub}
            disabled={syncStatus === "syncing" || isManualSyncing}
            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            size="lg"
          >
            <Upload className="h-5 w-5 mr-2" />
            {isManualSyncing ? "Syncing..." : "Sync to GitHub"}
          </Button>
          <Button
            onClick={handleLoadFromGitHub}
            variant="outline"
            disabled={syncStatus === "syncing" || isManualSyncing}
            className="flex-1"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            {isManualSyncing ? "Loading..." : "Load from GitHub"}
          </Button>
        </div>

        {/* 使用说明 */}
        <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
          <p>
            💡 <strong>Quick Sync Tips:</strong>
          </p>
          <p>• Click "Sync to GitHub" to upload your local data</p>
          <p>• Click "Load from GitHub" to download data from repository</p>
          <p>• Data automatically syncs when you send messages (if enabled)</p>
          <p>• Monitor sync status with the badge above</p>
        </div>
      </CardContent>
    </Card>
  );
}
