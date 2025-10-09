import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { useGitHubConfigStore } from "@/core/stores/github-config.store";
import { useGitHubSyncStore } from "@/core/stores/github-sync.store";
import { TestTube, Play, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export function GitHubTestSection() {
  const { isAuthenticated, isStorageConfigured } = useGitHubConfigStore();
  const { isGitHubEnabled, enableGitHubSync, disableGitHubSync, syncToGitHub } =
    useGitHubSyncStore();
  const [testResults, setTestResults] = useState<{
    config: boolean;
    auth: boolean;
    sync: boolean;
    error?: string;
  } | null>(null);

  const runTests = async () => {
    const results = {
      config: isStorageConfigured(),
      auth: isAuthenticated,
      sync: false,
      error: undefined as string | undefined,
    };

    try {
      if (results.config && results.auth) {
        // 测试同步功能
        await syncToGitHub();
        results.sync = true;
      }
    } catch (error) {
      results.error = error instanceof Error ? error.message : "Unknown error";
    }

    setTestResults(results);
  };

  const getTestStatus = (test: "config" | "auth" | "sync") => {
    if (!testResults) return "pending";
    return testResults[test] ? "success" : "error";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-200" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          GitHub Integration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {getStatusIcon(getTestStatus("config"))}
              <span>Storage Configuration</span>
            </div>
            <Badge variant={getTestStatus("config") === "success" ? "default" : "outline"}>
              {getTestStatus("config") === "success" ? "Configured" : "Not Configured"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {getStatusIcon(getTestStatus("auth"))}
              <span>GitHub Authentication</span>
            </div>
            <Badge variant={getTestStatus("auth") === "success" ? "default" : "outline"}>
              {getTestStatus("auth") === "success" ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {getStatusIcon(getTestStatus("sync"))}
              <span>Data Synchronization</span>
            </div>
            <Badge variant={getTestStatus("sync") === "success" ? "default" : "outline"}>
              {getTestStatus("sync") === "success" ? "Working" : "Not Tested"}
            </Badge>
          </div>
        </div>

        {testResults?.error && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Test Error:</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{testResults.error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={runTests} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Run Tests
          </Button>

          {isGitHubEnabled ? (
            <Button onClick={disableGitHubSync} variant="outline">
              Disable Sync
            </Button>
          ) : (
            <Button onClick={enableGitHubSync} variant="outline">
              Enable Sync
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>
            <strong>Test Coverage:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Storage configuration validation</li>
            <li>GitHub authentication status</li>
            <li>Data synchronization functionality</li>
            <li>Error handling and reporting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
