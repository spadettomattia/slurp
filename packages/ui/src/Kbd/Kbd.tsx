import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export type KbdProps<E extends ElementType = 'kbd'> = PolymorphicProps<E>;

/** A key of the keyboard ("⌘", "K", "Esc"), for shortcuts in text and menus. */
export function Kbd<E extends ElementType = 'kbd'>(props: KbdProps<E>) {
  const { as, css, className, ...rest } = useThemeProps('Kbd', props as KbdProps);
  const Root = (as ?? 'kbd') as ElementType;
  const styled = useCss('Kbd', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-kbd', styled.className, className)} {...root} />
    </>
  );
}
