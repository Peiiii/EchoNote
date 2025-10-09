import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { ToolInvocation, ToolInvocationStatus, ToolResult } from "@agent-labs/agent-chat";
import React from "react";
import { ToolPanel } from "./tool-panel";
import { ConfirmFooter } from "./confirm-footer";
import { useConfirmAction } from "../utils/use-confirm-action";
import { getParsedArgs } from "../utils/invocation-utils";

type Variant = "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";

export interface InteractiveToolPanelProps<Args, Result> {
  invocation: ToolInvocation<Args, Result>;
  onResult: (result: ToolResult) => void;
  icon: React.ReactNode;
  title: string;
  loadingText?: string; // PARTIAL_CALL
  callStatusText: string; // CALL
  preview: (args: Partial<Args>) => React.ReactNode; // content for PARTIAL_CALL/CALL
  confirm: () => Promise<Result>;
  confirmLabel: string;
  confirmIcon?: React.ReactNode;
  confirmVariant?: Variant;
  resultStatusText: (result: Result) => string;
  resultContent: (args: Partial<Args>, result: Result) => React.ReactNode;
  cancelStatusText?: string; // CANCELLED
  contentScrollable?: boolean; // pass to ToolPanel content
  stickyFooter?: boolean; // default true
}

// Generic panel to render a tool invocation lifecycle (partial -> call -> result/cancelled)
export function InteractiveToolPanel<Args, Result>(props: InteractiveToolPanelProps<Args, Result>) {
  const {
    invocation,
    onResult,
    icon,
    title,
    loadingText = "Loading...",
    callStatusText,
    preview,
    confirm,
    confirmLabel,
    confirmIcon,
    confirmVariant,
    resultStatusText,
    resultContent,
    cancelStatusText,
    contentScrollable,
    stickyFooter = true,
  } = props;

  const args = getParsedArgs<Args>(invocation) || ({} as Partial<Args>);
  const { isLoading, error, handleConfirm, handleCancel } = useConfirmAction<Args, Result>({
    invocation,
    onResult,
    confirm,
  });

  if (invocation.status === ToolInvocationStatus.PARTIAL_CALL) {
    return (
      <ToolPanel
        icon={icon}
        title={title}
        status="loading"
        statusText={loadingText}
        contentScrollable={contentScrollable}
        headerCardClassName="border-blue-200 dark:border-blue-800"
        contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
      >
        {preview(args)}
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.CALL) {
    return (
      <ToolPanel
        icon={icon}
        title={title}
        status="ready"
        statusText={callStatusText}
        forceExpanded={true}
        contentScrollable={contentScrollable}
        headerCardClassName="border-amber-200 dark:border-amber-800"
      >
        {stickyFooter ? (
          <div className="relative w-full">
            <div className="space-y-4 w-full pb-16">
              {preview(args)}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="sticky bottom-0 w-full bg-background border-t dark:border-gray-800 pt-3 pb-3">
              <ConfirmFooter
                confirmLabel={confirmLabel}
                loadingLabel={`${confirmLabel}...`}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isLoading={isLoading}
                confirmIcon={confirmIcon}
                variant={confirmVariant}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {preview(args)}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <ConfirmFooter
              confirmLabel={confirmLabel}
              loadingLabel={`${confirmLabel}...`}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              isLoading={isLoading}
              confirmIcon={confirmIcon}
              variant={confirmVariant}
            />
          </div>
        )}
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.RESULT) {
    const result = invocation.result as unknown as Result;
    return (
      <ToolPanel
        icon={icon}
        title={title}
        status={"success"}
        statusText={resultStatusText(result)}
        contentScrollable={contentScrollable}
        headerCardClassName={"border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950"}
        contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
      >
        {resultContent(args, result)}
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.CANCELLED) {
    return (
      <ToolPanel
        icon={icon}
        title={title}
        status={"ready"}
        statusText={cancelStatusText || "Cancelled"}
        contentScrollable={contentScrollable}
        headerCardClassName={"border-gray-200 dark:border-gray-800"}
        contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
      >
        {preview(args)}
      </ToolPanel>
    );
  }

  return (
    <ToolPanel
      icon={icon}
      title={title}
      status="ready"
      statusText=""
      headerCardClassName="border-gray-200 dark:border-gray-800"
    />
  );
}
