import { cx } from '@slurp-ui/utils';
import { useMemo, type ElementType, type ReactElement, type ReactNode } from 'react';

import { compileCss, mergeCss, type SlurpCss } from '../lib/css';
import type { PartsProps } from '../lib/polymorphic';
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

type AnyProps = Record<string, unknown> & { className?: string };

/**
 * Inner parts of a component: `parts` replaces the element, `partProps` adds props, `classNames` adds classes, and the
 * theme's `components.<name>.css.<part>` styles it. `part(name, Default, own)` renders one part.
 */
export function useParts<N extends ComponentName>(
  name: N,
  { parts, partProps, classNames }: PartsProps<Exclude<ThemeComponents[N]['parts'], 'root'>>,
) {
  const themed = useTheme().components[name]?.css as Partial<Record<string, SlurpCss>> | undefined;
  const key = themed ? JSON.stringify(themed) : '';
  const compiled = useMemo(() => {
    const classes: Record<string, string> = {};
    const rules: string[] = [];
    if (key) {
      for (const [p, style] of Object.entries(JSON.parse(key) as Record<string, SlurpCss>)) {
        if (p === 'root') continue;
        const c = compileCss(style);
        classes[p] = c.className;
        if (c.css) rules.push(c.css);
      }
    }
    const text = rules.join('');
    return {
      classes,
      style: text ? (
        <style href={styleId('parts', text)} precedence="slurp">
          {text}
        </style>
      ) : null,
    };
  }, [key]);

  const part = (
    p: Exclude<ThemeComponents[N]['parts'], 'root'>,
    Default: ElementType,
    own: AnyProps = {},
  ): ReactElement => {
    const Tag: ElementType =
      (parts as Partial<Record<string, ElementType>> | undefined)?.[p] ?? Default;
    const extra = (partProps as Partial<Record<string, AnyProps>> | undefined)?.[p];
    return (
      <Tag
        {...own}
        {...extra}
        className={cx(
          own.className,
          compiled.classes[p],
          (classNames as Partial<Record<string, string>> | undefined)?.[p],
          extra?.className,
        )}
      />
    );
  };
  return { part, style: compiled.style };
}
