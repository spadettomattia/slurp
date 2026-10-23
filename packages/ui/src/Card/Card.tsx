import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import { onColor } from '../lib/color';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

export interface CardOwnProps extends PartsProps<'media' | 'badge' | 'title' | 'description'> {
  title: ReactNode;
  description?: ReactNode;
  /** A value shown strong in the description pill ("1.239 €"). */
  value?: ReactNode;
  /** Before the value ("da"). */
  valuePrefix?: ReactNode;
  /** Pill at the top right ("−15%"). */
  badge?: ReactNode;
  /** Tint (any hex); default the accent. */
  color?: string;
  /** The media in the middle (illustration, photo), decorative. */
  media?: ReactNode;
  /** Renders a link. */
  href?: string;
}

export type CardProps<E extends ElementType = 'a'> = PolymorphicProps<E, CardOwnProps>;

/**
 * One tinted rounded surface (like a Tile): the media in the middle, the title and description pills inside at the
 * bottom left, never covering it. A link with `href`, a button with `onClick`.
 */
export function Card<E extends ElementType = 'a'>(props: CardProps<E>) {
  const {
    as,
    css,
    className,
    title,
    description,
    value,
    valuePrefix,
    badge,
    color,
    media,
    href,
    style,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Card', props as CardProps);
  const Root = (as ?? (href ? 'a' : rest.onClick ? 'button' : 'div')) as ElementType;
  const styled = useCss('Card', 'root', css);
  const { part, style: partsStyle } = useParts('Card', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const vars = {
    ...(color
      ? {
          '--slurp-card-color': color,
          '--slurp-card-on': /^#[0-9a-f]{6}$/i.test(color) ? onColor(color) : 'var(--slurp-fg)',
          '--slurp-animation-tint': color,
        }
      : null),
    ...style,
  } as CSSProperties;
  return (
    <>
      {styled.style}
      {partsStyle}
      <Root
        className={cx('slurp-card', styled.className, className)}
        href={href}
        style={vars}
        {...(Root === 'button' ? { type: 'button' } : null)}
        {...root}
      >
        {part('media', 'span', {
          className: 'slurp-card-media',
          'aria-hidden': true,
          children: (
            <>
              <span className="slurp-stage-glow" />
              <span className="slurp-stage-ring" />
              {media != null && <span className="slurp-card-art">{media}</span>}
            </>
          ),
        })}
        {badge != null && part('badge', 'span', { className: 'slurp-card-badge', children: badge })}
        {part('title', 'span', { className: 'slurp-card-title', children: title })}
        {(description != null || value != null) &&
          part('description', 'span', {
            className: 'slurp-card-description',
            children: (
              <>
                {description != null && <span>{description}</span>}
                {value != null && (
                  <strong>
                    {valuePrefix != null && <>{valuePrefix} </>}
                    {value}
                  </strong>
                )}
              </>
            ),
          })}
      </Root>
    </>
  );
}
