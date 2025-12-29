import { useState, useCallback } from "react";

interface AsyncOperationConfig<T> {
  operation: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
}

export function useAsyncOperation<T>({
  operation,
  onSuccess,
  onError,
}: AsyncOperationConfig<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [operation, onSuccess, onError, isLoading]);

  return {
    execute,
    isLoading,
    error,
  };
}
