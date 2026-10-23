import { cx } from '@slurp-ui/utils';
import { useMemo, type CSSProperties, type ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import { accentVars, resolveAccent } from '../lib/color';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface AccentScopeOwnProps {
  /** A `hue-*` preset (used as is) or any hex colour, turned into an accessible accent with `vivid()`. */
  color: string;
}

export type AccentScopeProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  AccentScopeOwnProps
>;

/**
 * Scopes the dynamic accent: everything inside reads `accent`, `on-accent`, `accent-soft`, `accent-ink` and `focus`
 * from `color`. The accent cross-fades over 0.9s when it changes (not with reduced motion).
 * Put `data-theme` subtrees outside the scope: the derived colours resolve against the scope's own `fg`.
 */
export function AccentScope<E extends ElementType = 'div'>(props: AccentScopeProps<E>) {
  const { as, css, className, style, color, ...rest } = useThemeProps(
    'AccentScope',
    props as AccentScopeProps,
  );
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('AccentScope', 'root', css);
  const vars = useMemo(() => accentVars(resolveAccent(color)), [color]);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-accent-scope', styled.className, className)}
        style={{ ...vars, ...style } as CSSProperties}
        {...root}
      />
    </>
  );
}
