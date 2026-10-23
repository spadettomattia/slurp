import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export type LinkProps<E extends ElementType = 'a'> = PolymorphicProps<E>;

/** Text link: accent-ink and underlined (not colour alone). `as` renders a router link. */
export function Link<E extends ElementType = 'a'>(props: LinkProps<E>) {
  const { as, css, className, ...rest } = useThemeProps('Link', props as LinkProps);
  const Root = (as ?? 'a') as ElementType;
  const styled = useCss('Link', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-link', styled.className, className)} {...root} />
    </>
  );
}
