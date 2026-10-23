import { cx } from '@slurp-ui/utils';
import { Children, type ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export type ShelfProps<E extends ElementType = 'ul'> = PolymorphicProps<E>;

/** A list of Cards: `repeat(auto-fill, minmax(220px, 1fr))`. Each child becomes a list item. */
export function Shelf<E extends ElementType = 'ul'>(props: ShelfProps<E>) {
  const { as, css, className, children, ...rest } = useThemeProps('Shelf', props as ShelfProps);
  const Root = (as ?? 'ul') as ElementType;
  const styled = useCss('Shelf', 'root', css);
  const root = useAnimationRoot(rest);
  const list = Root === 'ul' || Root === 'ol';
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-shelf', styled.className, className)} {...root}>
        {list
          ? Children.map(children, (child) => (child == null ? null : <li>{child}</li>))
          : children}
      </Root>
    </>
  );
}
