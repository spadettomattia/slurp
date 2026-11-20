import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface HairlineOwnProps {
  /** Default `horizontal`. A vertical hairline takes the height of its row. */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Default true: a visual rhythm only, hidden from assistive tech. Set false when it separates two sections in
   * meaning (then it is announced as a separator).
   */
  decorative?: boolean;
}

export type HairlineProps<E extends ElementType = 'hr'> = PolymorphicProps<E, HairlineOwnProps>;

/** A 1px line in the `line` colour, to separate groups where space alone is not enough. */
export function Hairline<E extends ElementType = 'hr'>(props: HairlineProps<E>) {
  const {
    as,
    css,
    className,
    orientation = 'horizontal',
    decorative = true,
    ...rest
  } = useThemeProps('Hairline', props as HairlineProps);
  const Root = (as ?? 'hr') as ElementType;
  const styled = useCss('Hairline', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-hairline', styled.className, className)}
        data-orientation={orientation}
        aria-hidden={decorative || undefined}
        aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
        {...root}
      />
    </>
  );
}
