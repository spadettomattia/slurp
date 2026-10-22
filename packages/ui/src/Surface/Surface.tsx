import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface SurfaceOwnProps {
  /** `surface` translucent (default) · `dock` near-opaque · `solid` opaque `surface-2`, no blur. */
  level?: 'surface' | 'dock' | 'solid';
  /** Radius token: `card` for cards and small panels (default), `panel` for large ones, `full` for bars. */
  radius?: 'sm' | 'md' | 'lg' | 'card' | 'panel' | 'full';
}

export type SurfaceProps<E extends ElementType = 'div'> = PolymorphicProps<E, SurfaceOwnProps>;

/**
 * Floating surface: fill, `blur-surface`, decorative `line` hairline, `shadow-float`.
 * Do not nest a Surface directly in another: inside, use flat tints.
 */
export function Surface<E extends ElementType = 'div'>(props: SurfaceProps<E>) {
  const {
    as,
    css,
    className,
    level = 'surface',
    radius = 'card',
    ...rest
  } = useThemeProps('Surface', props as SurfaceProps);
  const Root: ElementType = as ?? 'div';
  const styled = useCss('Surface', 'root', css);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-surface', styled.className, className)}
        data-level={level}
        data-radius={radius}
        {...rest}
      />
    </>
  );
}
