import { RxEvent } from "@/common/lib/rx-event";
import { useMemo } from "react";

export const useRxEvent = <T>() => {
  return useMemo(() => new RxEvent<T>(), []);
};
