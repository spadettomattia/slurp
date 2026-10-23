import { useCallback, useSyncExternalStore } from 'react';

export { COMPACT_QUERY } from '@slurp-ui/tokens';

const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/**
 * Whether a media query matches, kept in sync. During server rendering (and hydration) it returns `defaultMatches`.
 * `useMediaQuery(COMPACT_QUERY)` is the design system's phone layout.
 */
export function useMediaQuery(query: string, { defaultMatches = false } = {}): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatch()) return () => undefined;
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => (canMatch() ? window.matchMedia(query).matches : defaultMatches),
    () => defaultMatches,
  );
}
