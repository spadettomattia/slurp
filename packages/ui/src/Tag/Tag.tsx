import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface TagOwnProps {
  /** Default `accent`. Status tones add a dot in their colour; the word says the state, never the colour alone. */
  tone?: 'accent' | 'neutral' | 'success' | 'warning' | 'danger';
  /** A decorative icon before the text. */
  icon?: ReactNode;
  children?: ReactNode;
}

export type TagProps<E extends ElementType = 'span'> = PolymorphicProps<E, TagOwnProps>;

/** A static label for a state or a category ("Nuovo", "Bozza", "Verificato"). Not interactive: use Chip to toggle. */
export function Tag<E extends ElementType = 'span'>(props: TagProps<E>) {
  const {
    as,
    css,
    className,
    tone = 'accent',
    icon,
    children,
    ...rest
  } = useThemeProps('Tag', props as TagProps);
  const Root = (as ?? 'span') as ElementType;
  const styled = useCss('Tag', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-tag', styled.className, className)} data-tone={tone} {...root}>
        {icon != null && (
          <span className="slurp-tag-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </Root>
    </>
  );
}
