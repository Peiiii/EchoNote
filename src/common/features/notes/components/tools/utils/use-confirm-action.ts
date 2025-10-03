import { useState } from 'react';
import type { ToolInvocation, ToolResult } from '@agent-labs/agent-chat';
import { ToolInvocationStatus } from '@agent-labs/agent-chat';

interface UseConfirmActionOptions<ARGS, RESULT> {
  invocation: ToolInvocation<ARGS, RESULT>;
  onResult: (result: ToolResult) => void;
  confirm: () => Promise<RESULT>;
  cancelResult: RESULT;
}

export function useConfirmAction<ARGS, RESULT>({ invocation, onResult, confirm, cancelResult }: UseConfirmActionOptions<ARGS, RESULT>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await confirm();
      onResult({
        toolCallId: invocation.toolCallId,
        result,
        status: ToolInvocationStatus.RESULT,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onResult({
      toolCallId: invocation.toolCallId,
      result: cancelResult,
      status: ToolInvocationStatus.RESULT,
    });
  };

  return { isLoading, error, handleConfirm, handleCancel } as const;
}

