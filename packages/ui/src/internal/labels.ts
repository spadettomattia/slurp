import { createContext, useContext } from 'react';

import type { SlurpLabels } from '../lib/labels';

/** Texts set by the nearest SlurpProvider with `labels` (none: the components' Italian defaults). */
export const LabelsContext = createContext<SlurpLabels>({});

/** This component's texts from the provider; spread between its defaults and its own `labels` prop. */
export function useLabels<K extends keyof SlurpLabels>(name: K): NonNullable<SlurpLabels[K]> {
  return (useContext(LabelsContext)[name] ?? {}) as NonNullable<SlurpLabels[K]>;
}
