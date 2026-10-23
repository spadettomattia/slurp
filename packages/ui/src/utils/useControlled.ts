import { useCallback, useEffect, useRef, useState } from 'react';

export interface ControlledOptions<T> {
  /** Controlled value: when defined, the component follows it and only reports changes. */
  value: T | undefined;
  /** Initial value when uncontrolled. */
  defaultValue: T;
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Controlled / uncontrolled state with one API (`value` + `defaultValue` + `on…Change`). Whether it is controlled is
 * decided on mount, like native inputs.
 */
export function useControlled<T>({
  value,
  defaultValue,
  onChange,
}: ControlledOptions<T>): [T, (next: T) => void] {
  const [controlled] = useState(value !== undefined);
  const [own, setOwn] = useState(defaultValue);
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });
  const set = useCallback(
    (next: T) => {
      if (!controlled) setOwn(next);
      latest.current?.(next);
    },
    [controlled],
  );
  return [controlled ? (value as T) : own, set];
}
