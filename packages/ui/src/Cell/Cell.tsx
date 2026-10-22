import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export type CellProps<E extends ElementType = 'div'> = PolymorphicProps<E>;

/** The base primitive: any element, styled with `css`. */
export function Cell<E extends ElementType = 'div'>(props: CellProps<E>) {
  const { as, css, className, ...rest } = useThemeProps('Cell', props as CellProps);
  const Root: ElementType = as ?? 'div';
  const styled = useCss('Cell', 'root', css);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-cell', styled.className, className)} {...rest} />
    </>
  );
}
