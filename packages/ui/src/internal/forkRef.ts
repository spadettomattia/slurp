import { useMemo, type Ref, type RefCallback } from 'react';

/** Sets a ref and returns how to clear it (React 19 ref callbacks may return their own cleanup). */
function assign<T>(ref: Ref<T> | undefined, value: T | null): () => void {
  if (typeof ref === 'function') {
    const cleanup = ref(value);
    return typeof cleanup === 'function' ? cleanup : () => ref(null);
  }
  if (ref) {
    ref.current = value as T;
    return () => {
      ref.current = null as T;
    };
  }
  return () => undefined;
}

/** One ref for two: returns the only defined ref as is, so a single ref costs nothing. */
export function useForkRef<T>(a: Ref<T> | undefined, b: Ref<T> | undefined): Ref<T> | undefined {
  return useMemo((): Ref<T> | undefined => {
    if (!a || !b) return a ?? b;
    const merged: RefCallback<T> = (value) => {
      const clear = [assign(a, value), assign(b, value)];
      return () => {
        for (const c of clear) c();
      };
    };
    return merged;
  }, [a, b]);
}
