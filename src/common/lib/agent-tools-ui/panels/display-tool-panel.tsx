import { ToolInvocation, ToolInvocationStatus } from "@agent-labs/agent-chat";
import React from "react";
import { ToolPanel } from "./tool-panel";
import { getParsedArgs } from "../utils/invocation-utils";

export interface DisplayToolPanelProps<Args, Result> {
  invocation: ToolInvocation<Args, Result>;
  icon: React.ReactNode;
  title: string;
  loadingText?: string;
  loadingIcon?: React.ReactNode;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  readyIcon?: React.ReactNode;
  successStatusText?: (result: Result) => string;
  errorStatusText?: (error: unknown) => string;
  readyStatusText?: string;
  contentScrollable?: boolean;
  headerCardClassName?: string;
  contentCardClassName?: string;
  children: (args: Partial<Args>, result?: Result, error?: unknown) => React.ReactNode;
}

export function DisplayToolPanel<Args, Result>({
  invocation,
  icon,
  title,
  loadingText = "Loading...",
  loadingIcon,
  successIcon,
  errorIcon,
  readyIcon,
  successStatusText,
  errorStatusText,
  readyStatusText = "Ready",
  contentScrollable = true,
  headerCardClassName,
  contentCardClassName,
  children,
}: DisplayToolPanelProps<Args, Result>) {
  const args = getParsedArgs<Args>(invocation) || ({} as Partial<Args>);

  if (invocation.status === ToolInvocationStatus.PARTIAL_CALL) {
    return (
      <ToolPanel
        icon={loadingIcon || icon}
        title={title}
        status="loading"
        statusText={loadingText}
        contentScrollable={contentScrollable}
        headerCardClassName={headerCardClassName || "border-blue-200 dark:border-blue-800"}
        contentCardClassName={contentCardClassName || "border-gray-200 dark:border-gray-800 mt-2"}
      >
        {children(args)}
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.CALL) {
    return (
      <ToolPanel
        icon={loadingIcon || icon}
        title={title}
        status="loading"
        statusText={loadingText}
        contentScrollable={contentScrollable}
        headerCardClassName={headerCardClassName || "border-blue-200 dark:border-blue-800"}
        contentCardClassName={contentCardClassName || "border-gray-200 dark:border-gray-800 mt-2"}
      >
        {children(args)}
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.RESULT) {
    const result = invocation.result as unknown as Result;
    return (
      <ToolPanel
        icon={successIcon || icon}
        title={title}
        status="success"
        statusText={successStatusText ? successStatusText(result) : "Success"}
        contentScrollable={contentScrollable}
        headerCardClassName={
          headerCardClassName ||
          "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950"
        }
        contentCardClassName={contentCardClassName || "border-gray-200 dark:border-gray-800 mt-2"}
      >
        {children(args, result)}
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.ERROR) {
    const error = invocation.error;
    return (
      <ToolPanel
        icon={errorIcon || icon}
        title={title}
        status="error"
        statusText={errorStatusText ? errorStatusText(error) : "Error occurred"}
        contentScrollable={contentScrollable}
        headerCardClassName={headerCardClassName || "border-red-200 dark:border-red-800"}
        contentCardClassName={contentCardClassName || "border-red-200 dark:border-red-800 mt-2"}
      >
        {children(args, undefined, error)}
      </ToolPanel>
    );
  }

  return (
    <ToolPanel
      icon={readyIcon || icon}
      title={title}
      status="ready"
      statusText={readyStatusText}
      contentScrollable={contentScrollable}
      headerCardClassName={headerCardClassName || "border-gray-200 dark:border-gray-800"}
      contentCardClassName={contentCardClassName || "border-gray-200 dark:border-gray-800 mt-2"}
    >
      {children(args)}
    </ToolPanel>
  );
}
