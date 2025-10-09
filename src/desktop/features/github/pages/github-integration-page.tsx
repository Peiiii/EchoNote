import { GitHubAuthStatusSection } from "../components/github-auth-status-section";
import { GitHubStorageConfigSection } from "../components/github-storage-config-section";
import { GitHubSyncStatus } from "../components/github-sync-status";
import { GitHubDebugInfo } from "../components/github-debug-info";
import { GitHubSetupWizard } from "../components/github-setup-wizard";
import { GitHubTestSection } from "../components/github-test-section";
import { QuickSyncSection } from "../components/quick-sync-section";

export function GitHubIntegrationPage() {
  return (
    <div className="h-screen overflow-y-auto w-full flex flex-col max-w-7xl mx-auto">
      <div className="w-full px-6 py-6">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">GitHub Integration</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Store and synchronize your StillRoot data in your GitHub repository. Get version
              control, backup, and access from anywhere.
            </p>
          </div>

          {/* Quick Sync Section - Full Width */}
          <div className="w-full">
            <QuickSyncSection />
          </div>

          {/* Setup Wizard - Full Width */}
          <div className="w-full">
            <GitHubSetupWizard />
          </div>

          {/* Two Column Layout for Other Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Authentication Status */}
              <GitHubAuthStatusSection />

              {/* Storage Configuration */}
              <GitHubStorageConfigSection />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* GitHub Sync Status */}
              <GitHubSyncStatus />

              {/* Test Section */}
              <GitHubTestSection />
            </div>
          </div>

          {/* Debug Information - Full Width at Bottom */}
          <div className="w-full">
            <GitHubDebugInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
