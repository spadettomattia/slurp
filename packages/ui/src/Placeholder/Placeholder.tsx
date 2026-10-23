import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface PlaceholderOwnProps {
  /** Rounded shapes only: `circle`, `capsule` (default) or `square` (soft corners). */
  shape?: 'circle' | 'capsule' | 'square';
  /** Number (px) or any CSS length. Default 100%. */
  width?: number | string;
  /** Number (px) or any CSS length. Default 16px (the circle and the square follow the width). */
  height?: number | string;
}

export type PlaceholderProps<E extends ElementType = 'span'> = PolymorphicProps<
  E,
  PlaceholderOwnProps
>;

const len = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v);

/** Loading shape (skeleton): decorative, hidden from assistive tech; mark the loading region with aria-busy. */
export function Placeholder<E extends ElementType = 'span'>(props: PlaceholderProps<E>) {
  const {
    as,
    css,
    className,
    shape = 'capsule',
    width,
    height,
    style,
    ...rest
  } = useThemeProps('Placeholder', props as PlaceholderProps);
  const Root = (as ?? 'span') as ElementType;
  const styled = useCss('Placeholder', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-placeholder', styled.className, className)}
        aria-hidden="true"
        data-shape={shape}
        style={{ width: len(width), height: len(height), ...style } as CSSProperties}
        {...root}
      />
    </>
  );
}
