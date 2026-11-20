import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface ProseOwnProps {
  /** Default `md`: body text. `lg` for an article's lead size throughout. */
  size?: 'md' | 'lg';
}

export type ProseProps<E extends ElementType = 'div'> = PolymorphicProps<E, ProseOwnProps>;

/**
 * Long text you do not write element by element — Markdown, MDX, a CMS's HTML: headings, paragraphs, lists, quotes,
 * tables, code and images take the design system's type scale and spacing, in a readable measure (about 70
 * characters). Components placed inside keep their own styles.
 */
export function Prose<E extends ElementType = 'div'>(props: ProseProps<E>) {
  const { as, css, className, size = 'md', ...rest } = useThemeProps('Prose', props as ProseProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Prose', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-prose', styled.className, className)} data-size={size} {...root} />
    </>
  );
}
