import { PageContainer } from "@/common/components/page-container";
import { TimeFormatDemo } from "../components/time-format-demo";

export function DemoChatPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Demo Chat</h1>
          <p className="text-muted-foreground">
            Chat functionality page for demo extension
          </p>
        </div>
        <div className="p-4 border rounded">
          <p>Here you can see the chat functionality of the Demo extension</p>
        </div>
        
        {/* Time Formatting Demo */}
        <TimeFormatDemo />
      </div>
    </PageContainer>
  );
} 