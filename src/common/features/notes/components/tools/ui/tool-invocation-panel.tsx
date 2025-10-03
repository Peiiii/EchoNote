import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { ToolInvocation, ToolInvocationStatus, ToolResult } from '@agent-labs/agent-chat';
import React from 'react';
import { ToolPanel } from './tool-panel';
import { ConfirmFooter } from './confirm-footer';
import { useConfirmAction } from '../utils/use-confirm-action';
import { getParsedArgs } from '../utils/invocation-utils';

type Variant = 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';

export interface ToolInvocationPanelProps<Args, Result> {
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
}

// Generic panel to render a tool invocation lifecycle (partial -> call -> result/cancelled)
export function ToolInvocationPanel<Args, Result>(props: ToolInvocationPanelProps<Args, Result>) {
  const {
    invocation,
    onResult,
    icon,
    title,
    loadingText = 'Loading...',
    callStatusText,
    preview,
    confirm,
    confirmLabel,
    confirmIcon,
    confirmVariant,
    resultStatusText,
    resultContent,
    cancelStatusText,
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
        headerCardClassName="border-blue-200"
        contentCardClassName="border-gray-200 mt-2"
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
        headerCardClassName="border-amber-200"
      >
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
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.RESULT) {
    const result = invocation.result as unknown as Result;
    return (
      <ToolPanel
        icon={icon}
        title={title}
        status={'success'}
        statusText={resultStatusText(result)}
        headerCardClassName={'border-green-200 bg-green-50'}
        contentCardClassName="border-gray-200 mt-2"
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
        status={'ready'}
        statusText={cancelStatusText || 'Cancelled'}
        headerCardClassName={'border-gray-200'}
        contentCardClassName="border-gray-200 mt-2"
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
      headerCardClassName="border-gray-200"
    />
  );
}

