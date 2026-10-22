import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { MaybeResponsive, SlurpCss, SpaceValue } from '../lib/css';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface FlowOwnProps {
  /** Default `column`. */
  direction?: MaybeResponsive<'column' | 'row'>;
  /** Step of the space scale or any length. Default `4` (`--slurp-flow-gap`). */
  gap?: MaybeResponsive<SpaceValue>;
  align?: MaybeResponsive<CSSProperties['alignItems']>;
  justify?: MaybeResponsive<CSSProperties['justifyContent']>;
  wrap?: boolean;
}

export type FlowProps<E extends ElementType = 'div'> = PolymorphicProps<E, FlowOwnProps>;

/** A column or a row of children with a gap from the space scale. */
export function Flow<E extends ElementType = 'div'>(props: FlowProps<E>) {
  const { as, css, className, direction, gap, align, justify, wrap, ...rest } = useThemeProps(
    'Flow',
    props as FlowProps,
  );
  const Root: ElementType = as ?? 'div';
  const layout: SlurpCss = {
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : undefined,
  };
  const styled = useCss('Flow', 'root', layout, css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-flow', styled.className, className)} {...root} />
    </>
  );
}
