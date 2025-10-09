import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { useGitHubConfigStore } from "@/core/stores/github-config.store";
import { Github, Settings, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

type SetupStep = "overview" | "auth" | "config" | "complete";

export function GitHubSetupWizard() {
  const { isAuthenticated, isStorageConfigured } = useGitHubConfigStore();
  const [currentStep, setCurrentStep] = useState<SetupStep>("overview");

  const getStepStatus = (step: SetupStep) => {
    switch (step) {
      case "auth":
        return isAuthenticated ? "completed" : "current";
      case "config":
        return !isAuthenticated ? "disabled" : isStorageConfigured() ? "completed" : "current";
      case "complete":
        return isAuthenticated && isStorageConfigured() ? "completed" : "disabled";
      default:
        return "current";
    }
  };

  const canProceed = (step: SetupStep) => {
    switch (step) {
      case "auth":
        return true;
      case "config":
        return isAuthenticated;
      case "complete":
        return isAuthenticated && isStorageConfigured();
      default:
        return true;
    }
  };

  const getStepIcon = (step: SetupStep, status: string) => {
    if (status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (status === "disabled") {
      return <div className="h-5 w-5 rounded-full bg-gray-200" />;
    }

    switch (step) {
      case "auth":
        return <Github className="h-5 w-5" />;
      case "config":
        return <Settings className="h-5 w-5" />;
      case "complete":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-blue-200" />;
    }
  };

  const getStepTitle = (step: SetupStep) => {
    switch (step) {
      case "overview":
        return "Setup Overview";
      case "auth":
        return "GitHub Authentication";
      case "config":
        return "Storage Configuration";
      case "complete":
        return "Setup Complete";
      default:
        return "";
    }
  };

  const getStepDescription = (step: SetupStep) => {
    switch (step) {
      case "overview":
        return "Follow these steps to configure GitHub integration for your data storage.";
      case "auth":
        return "Connect your GitHub account to enable repository access.";
      case "config":
        return "Configure where and how your data will be stored in GitHub.";
      case "complete":
        return "Your GitHub integration is ready! You can now sync your data.";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {(["auth", "config", "complete"] as SetupStep[]).map(step => {
                const status = getStepStatus(step);
                const isCurrent = status === "current";
                const isCompleted = status === "completed";
                const isDisabled = status === "disabled";

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isCurrent
                        ? "border-blue-200 bg-blue-50"
                        : isCompleted
                          ? "border-green-200 bg-green-50"
                          : isDisabled
                            ? "border-gray-200 bg-gray-50"
                            : "border-gray-200"
                    }`}
                  >
                    {getStepIcon(step, status)}
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {step === "auth" && "Step 1: GitHub Authentication"}
                        {step === "config" && "Step 2: Storage Configuration"}
                        {step === "complete" && "Step 3: Setup Complete"}
                      </h3>
                      <p className="text-sm text-gray-600">{getStepDescription(step)}</p>
                    </div>
                    {isCompleted && (
                      <Badge variant="default" className="bg-green-600">
                        Completed
                      </Badge>
                    )}
                    {isCurrent && <Badge variant="outline">Current</Badge>}
                  </div>
                );
              })}
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>What you'll get:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Secure data storage in your GitHub repository</li>
                <li>Automatic synchronization of your notes and messages</li>
                <li>Version control and backup of your data</li>
                <li>Access to your data from anywhere</li>
              </ul>
            </div>
          </div>
        );

      case "auth":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To store your data in GitHub, we need access to your repositories. This allows us to
              create and update files in the repository you specify.
            </p>

            {isAuthenticated ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Authentication Complete!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You're now connected to GitHub and can proceed to the next step.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Click the button below to connect your GitHub account. You'll be redirected to
                  GitHub to authorize access.
                </p>
              </div>
            )}
          </div>
        );

      case "config":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure where your data will be stored in GitHub. You can specify the repository,
              branch, and folder structure.
            </p>

            {isStorageConfigured() ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Configuration Complete!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your storage settings are configured and ready to use.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please configure your storage settings in the Storage Configuration section below.
                </p>
              </div>
            )}
          </div>
        );

      case "complete":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-800 mb-2">Setup Complete!</h3>
              <p className="text-green-700">
                Your GitHub integration is now fully configured and ready to use.
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>What's next:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Enable GitHub sync in the chat interface</li>
                <li>Your data will automatically sync to GitHub</li>
                <li>You can manually sync or load data as needed</li>
                <li>Monitor sync status in the GitHub integration page</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    const steps: SetupStep[] = ["overview", "auth", "config", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: SetupStep[] = ["overview", "auth", "config", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canGoNext = canProceed(currentStep) && currentStep !== "complete";
  const canGoPrevious = currentStep !== "overview";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {getStepTitle(currentStep)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={!canGoPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!canGoNext}>
            {currentStep === "complete" ? "Finish" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
