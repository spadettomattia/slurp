import { cx } from '@slurp-ui/utils';
import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type ReactElement,
} from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import { bentoLayout } from '../lib/layout';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface BentoOwnProps {
  /**
   * `auto` (default): spans from `bentoLayout()` — children in priority order, each `weight` prop (a size measure)
   * shaping the grid. `manual`: set `--slurp-bento-cols` / `--slurp-bento-rows` on the children yourself.
   */
  layout?: 'auto' | 'manual';
}

export type BentoProps<E extends ElementType = 'div'> = PolymorphicProps<E, BentoOwnProps>;

type ChildProps = { weight?: number; style?: CSSProperties; size?: string };

/** The entry grid: 12 fluid columns; 2 columns on narrow screens (the first item two rows tall). */
export function Bento<E extends ElementType = 'div'>(props: BentoProps<E>) {
  const {
    as,
    css,
    className,
    layout = 'auto',
    children,
    ...rest
  } = useThemeProps('Bento', props as BentoProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Bento', 'root', css);
  const root = useAnimationRoot(rest);
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<ChildProps>[];
  const spans =
    layout === 'auto'
      ? bentoLayout(items.map((c, i) => ({ id: String(i), weight: c.props.weight })))
      : null;
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-bento', styled.className, className)} {...root}>
        {spans
          ? items.map((child, i) => {
              const s = spans[i];
              if (!s) return child;
              const { weight: _weight, ...childProps } = child.props;
              return cloneElement(child, {
                ...childProps,
                weight: undefined,
                size: childProps.size ?? s.size,
                style: {
                  '--slurp-bento-cols': s.colSpan,
                  '--slurp-bento-rows': s.rowSpan,
                  ...childProps.style,
                } as CSSProperties,
              });
            })
          : children}
      </Root>
    </>
  );
}
