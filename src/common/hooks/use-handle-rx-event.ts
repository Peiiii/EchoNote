import { RxEvent } from "@/common/lib/rx-event";
import { useMemoizedFn } from "ahooks";
import { useEffect } from "react";

export const useHandleRxEvent = <T>(event: RxEvent<T>, handler: (value: T) => void) => {
  const memoizedHandler = useMemoizedFn(handler);
  useEffect(() => {
    return event.listen(memoizedHandler);
  }, [event, memoizedHandler]);
};
