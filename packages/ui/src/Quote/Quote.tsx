import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { Avatar } from '../Avatar/Avatar';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

export interface QuoteOwnProps extends PartsProps<'quote' | 'caption'> {
  /** The words quoted. */
  children: ReactNode;
  /** Who said it. */
  author?: string;
  /** Their role or where it comes from. */
  role?: ReactNode;
  /** Picture of the author (else their initials). */
  avatar?: string;
  /** A link to the source (`cite`). */
  cite?: string;
}

export type QuoteProps<E extends ElementType = 'figure'> = PolymorphicProps<E, QuoteOwnProps>;

/** A quotation or a testimonial: the words on an accent-soft surface, who said them below. */
export function Quote<E extends ElementType = 'figure'>(props: QuoteProps<E>) {
  const {
    as,
    css,
    className,
    children,
    author,
    role,
    avatar,
    cite,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Quote', props as QuoteProps);
  const Root = (as ?? 'figure') as ElementType;
  const styled = useCss('Quote', 'root', css);
  const { part, style } = useParts('Quote', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      {style}
      <Root className={cx('slurp-quote', styled.className, className)} {...root}>
        {part('quote', 'blockquote', { className: 'slurp-quote-text', cite, children })}
        {author != null &&
          part('caption', 'figcaption', {
            className: 'slurp-quote-caption',
            children: (
              <>
                <Avatar name={author} src={avatar} size="sm" decorative />
                <span className="slurp-quote-who">
                  <span className="slurp-quote-author">{author}</span>
                  {role != null && <span className="slurp-quote-role">{role}</span>}
                </span>
              </>
            ),
          })}
      </Root>
    </>
  );
}
