import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { SlurpContext, type ColorSchemeState } from '../internal/context';
import {
  DEFAULT_STORAGE_KEY,
  defaultTheme,
  styleId,
  themeCss,
  type ColorSchemeMode,
  type Theme,
} from '../lib/theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export interface SlurpProviderProps {
  /** From `createTheme()`. */
  theme?: Theme;
  /** localStorage key that remembers the chosen scheme; `null` disables persistence. Default `slurp-theme`. */
  storageKey?: string | null;
  children?: ReactNode;
}

const isMode = (v: unknown): v is ColorSchemeMode =>
  v === 'light' || v === 'dark' || v === 'system';

// Storage can throw (private mode, blocked site data): every access is guarded and simply falls back.
function readStored(key: string | null): ColorSchemeMode | null {
  if (!key) return null;
  try {
    const v = window.localStorage.getItem(key);
    return isMode(v) ? v : null;
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
function subscribeStorage(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function subscribeSystem(onChange: () => void) {
  const query = window.matchMedia?.(DARK_QUERY);
  query?.addEventListener('change', onChange);
  return () => query?.removeEventListener('change', onChange);
}
const systemSnapshot = () => (window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light');

/** Writes `data-theme` on <html>: `light` / `dark`, or no attribute for `system` (prefers-color-scheme decides). */
function applyMode(mode: ColorSchemeMode) {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
}

/**
 * Theme, colour scheme and runtime styles for everything inside.
 * At the app root it renders no element: the colour scheme goes on <html data-theme>, theme overrides into one
 * hoisted <style>. Nested, it themes only its subtree (through a `display: contents` wrapper) and shares the
 * colour scheme of the outer provider.
 */
export function SlurpProvider({
  theme = defaultTheme,
  storageKey = DEFAULT_STORAGE_KEY,
  children,
}: SlurpProviderProps) {
  const outer = useContext(SlurpContext).colorScheme;
  const scope = useId();
  const stored = useSyncExternalStore(
    subscribeStorage,
    () => readStored(storageKey),
    () => null,
  );
  // A choice that could not be stored (or storage disabled) lives in state and wins over the stored one.
  const [local, setLocal] = useState<ColorSchemeMode | null>(null);
  const mode = local ?? stored ?? theme.colorScheme;
  const system = useSyncExternalStore(subscribeSystem, systemSnapshot, () => 'light' as const);

  // Reads storage again: during hydration `stored` is still the server snapshot (null) for one render.
  useEffect(() => {
    if (!outer) applyMode(local ?? readStored(storageKey) ?? theme.colorScheme);
  }, [outer, mode, local, storageKey, theme.colorScheme]);

  const setMode = useCallback(
    (next: ColorSchemeMode) => {
      if (!storageKey) return setLocal(next);
      try {
        window.localStorage.setItem(storageKey, next);
        setLocal(null);
      } catch {
        setLocal(next);
      }
      for (const notify of listeners) notify();
    },
    [storageKey],
  );

  const own = useMemo<ColorSchemeState>(
    () => ({ mode, setMode, resolved: mode === 'system' ? system : mode }),
    [mode, setMode, system],
  );
  const colorScheme = outer ?? own;
  const value = useMemo(() => ({ theme, colorScheme }), [theme, colorScheme]);
  const css = useMemo(() => themeCss(theme, outer ? scope : undefined), [theme, outer, scope]);

  const style = css && (
    <style href={styleId('theme', css)} precedence="slurp">
      {css}
    </style>
  );
  return (
    <SlurpContext value={value}>
      {style}
      {outer ? (
        <div data-slurp-theme={scope} style={{ display: 'contents' }}>
          {children}
        </div>
      ) : (
        children
      )}
    </SlurpContext>
  );
}
