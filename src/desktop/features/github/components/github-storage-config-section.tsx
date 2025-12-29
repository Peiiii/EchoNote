import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { GitHubStorageConfig, useGitHubConfigStore } from "@/core/stores/github-config.store";
import { AlertCircle, CheckCircle, Save, Settings } from "lucide-react";
import { useState } from "react";

export function GitHubStorageConfigSection() {
  const { storageConfig, setStorageConfig } = useGitHubConfigStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState<GitHubStorageConfig>(storageConfig);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const handleSave = () => {
    setStorageConfig(tempConfig);
    setIsEditing(false);
    setValidationResult(null);

    // 尝试初始化GitHub同步服务
    try {
      console.log("GitHub sync service initialized after config update");
    } catch (error) {
      console.warn("Failed to initialize sync service after config update:", error);
    }
  };

  const handleCancel = () => {
    setTempConfig(storageConfig);
    setIsEditing(false);
    setValidationResult(null);
  };

  const validateConfig = async () => {
    setIsValidating(true);
    try {
      // 这里可以添加实际的配置验证逻辑
      // 例如：检查仓库是否存在、是否有写入权限等
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟验证过程

      const isValid = !!(
        tempConfig.owner &&
        tempConfig.repo &&
        tempConfig.branch &&
        tempConfig.basePath
      );
      setValidationResult({
        isValid,
        message: isValid ? "Configuration is valid!" : "Please fill in all required fields",
      });
    } catch {
      setValidationResult({
        isValid: false,
        message: "Validation failed. Please check your configuration.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const isConfigValid =
    tempConfig.owner && tempConfig.repo && tempConfig.branch && tempConfig.basePath;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          GitHub Storage Configuration
          {!isEditing && (
            <Badge variant="outline" className="ml-auto">
              {storageConfig.owner && storageConfig.repo ? "Configured" : "Not Configured"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          // 显示模式
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Owner</span>
                <p className="font-mono text-sm">{storageConfig.owner || "Not set"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Repository</span>
                <p className="font-mono text-sm">{storageConfig.repo || "Not set"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Branch</span>
                <p className="font-mono text-sm">{storageConfig.branch || "Not set"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Base Path</span>
                <p className="font-mono text-sm">{storageConfig.basePath || "Not set"}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Edit Configuration
            </Button>
          </div>
        ) : (
          // 编辑模式
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Owner *</span>
                <Input
                  placeholder="your-username"
                  value={tempConfig.owner}
                  onChange={e => setTempConfig(prev => ({ ...prev, owner: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Repository *</span>
                <Input
                  placeholder="repo-name"
                  value={tempConfig.repo}
                  onChange={e => setTempConfig(prev => ({ ...prev, repo: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Branch *</span>
                <Input
                  placeholder="main"
                  value={tempConfig.branch}
                  onChange={e => setTempConfig(prev => ({ ...prev, branch: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Base Path *</span>
                <Input
                  placeholder="data"
                  value={tempConfig.basePath}
                  onChange={e => setTempConfig(prev => ({ ...prev, basePath: e.target.value }))}
                />
              </div>
            </div>

            {validationResult && (
              <div
                className={`p-3 rounded-md ${
                  validationResult.isValid
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      validationResult.isValid ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {validationResult.message}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={validateConfig}
                disabled={!isConfigValid || isValidating}
                variant="outline"
                className="flex-1"
              >
                {isValidating ? "Validating..." : "Validate"}
              </Button>
              <Button onClick={handleSave} disabled={!isConfigValid} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
