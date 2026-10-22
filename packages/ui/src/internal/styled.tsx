import { useMemo, type ReactNode } from 'react';

import { compileCss, mergeCss, type SlurpCss } from '../lib/css';
import { styleId, type ComponentName, type ThemeComponents } from '../lib/theme';
import { useTheme } from './context';

/** Props with the theme's `components.<name>.defaults` filled in (explicit props win, `undefined` does not). */
export function useThemeProps<N extends ComponentName, P extends object>(name: N, props: P): P {
  const defaults = useTheme().components[name]?.defaults;
  if (!defaults) return props;
  const out: Record<string, unknown> = { ...defaults };
  for (const [k, v] of Object.entries(props)) if (v !== undefined) out[k] = v;
  return out as P;
}

/**
 * Compiles the `css` of one part: theme `components.<name>.css.<part>` first, then the component's own layout css,
 * then the instance `css`. Returns the class names and the <style> to render (React hoists it into <head>).
 */
export function useCss<N extends ComponentName>(
  name: N,
  part: ThemeComponents[N]['parts'],
  ...css: (SlurpCss | undefined)[]
): { className: string; style: ReactNode } {
  const themed = (
    useTheme().components[name]?.css as Partial<Record<string, SlurpCss>> | undefined
  )?.[part];
  const merged = mergeCss(themed, ...css);
  // Serialising is cheaper than a deep comparison and keeps the memo stable across renders.
  const key = merged ? JSON.stringify(merged) : '';
  return useMemo(() => {
    const { className, css: text } = compileCss(key ? (JSON.parse(key) as SlurpCss) : undefined);
    return {
      className,
      style: text ? (
        <style href={styleId('css', text)} precedence="slurp">
          {text}
        </style>
      ) : null,
    };
  }, [key]);
}
