import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export type FrameProps<E extends ElementType = 'div'> = PolymorphicProps<E>;

/** Centred page column: max 1280px, gutter 24px (16px on phones). `--slurp-frame-max`, `--slurp-frame-gutter`. */
export function Frame<E extends ElementType = 'div'>(props: FrameProps<E>) {
  const { as, css, className, ...rest } = useThemeProps('Frame', props as FrameProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Frame', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-frame', styled.className, className)} {...root} />
    </>
  );
}
