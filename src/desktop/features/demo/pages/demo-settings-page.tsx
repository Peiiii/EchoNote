import { PageContainer } from "@/common/components/page-container";

export function DemoSettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Demo Settings</h1>
          <p className="text-muted-foreground">
            Settings page for demo extension
          </p>
        </div>
        <div className="p-4 border rounded">
          <p>Here you can configure various settings for the Demo extension</p>
        </div>
      </div>
    </PageContainer>
  );
} 