import { useCallback, useState } from "react";
import { useIsMounted } from "./useIsMounted";

export function useAsyncState<T>(initialState: T): [T, (s: T) => void] {
  const isMounted = useIsMounted();
  const [val, set] = useState<T>(initialState);

  const setter = useCallback(
    (s: T) => {
      if (isMounted.current) {
        set(s);
      }
    },
    [set, isMounted]
  );

  return [val, setter];
}

export function useAsyncUndefinedState<T = undefined>(): [T | undefined, (s: T | undefined) => void] {
  const isMounted = useIsMounted();
  const [val, set] = useState<T | undefined>();

  const setter = useCallback(
    (s: T | undefined) => {
      if (isMounted.current) {
        set(s);
      }
    },
    [set, isMounted]
  );

  return [val, setter];
}
