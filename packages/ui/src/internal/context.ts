import { createContext, useContext } from 'react';

import {
  defaultTheme,
  type ColorSchemeMode,
  type ResolvedColorScheme,
  type Theme,
} from '../lib/theme';

export interface ColorSchemeState {
  /** What the person chose (or the theme default): `light`, `dark` or `system`. */
  mode: ColorSchemeMode;
  setMode: (mode: ColorSchemeMode) => void;
  /** The scheme actually shown. `system` resolves through prefers-color-scheme (light during SSR). */
  resolved: ResolvedColorScheme;
}

interface SlurpContextValue {
  theme: Theme;
  colorScheme: ColorSchemeState | null;
}

export const SlurpContext = createContext<SlurpContextValue>({
  theme: defaultTheme,
  colorScheme: null,
});

/** The active theme; the default theme outside a SlurpProvider. */
export function useTheme(): Theme {
  return useContext(SlurpContext).theme;
}

/** Colour scheme of the nearest SlurpProvider: `{ mode, setMode, resolved }`. */
export function useColorScheme(): ColorSchemeState {
  const state = useContext(SlurpContext).colorScheme;
  if (!state) throw new Error('Slurp: useColorScheme() needs a <SlurpProvider> above it.');
  return state;
}
