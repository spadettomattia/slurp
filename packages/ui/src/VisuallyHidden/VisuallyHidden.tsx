import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import type { PolymorphicProps } from '../lib/polymorphic';

export type VisuallyHiddenProps<E extends ElementType = 'span'> = PolymorphicProps<E>;

/** Content for assistive technology only: read by screen readers, not shown. */
export function VisuallyHidden<E extends ElementType = 'span'>(props: VisuallyHiddenProps<E>) {
  const { as, className, css: _css, ...rest } = props as VisuallyHiddenProps;
  const Root = (as ?? 'span') as ElementType;
  return <Root className={cx('slurp-visually-hidden', className)} {...rest} />;
}
