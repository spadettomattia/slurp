import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import { onColor } from '../lib/color';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

export interface TileOwnProps extends PartsProps<
  'blob' | 'text' | 'title' | 'subtitle' | 'badge' | 'media'
> {
  /** The section's name. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Small pill at the top (a count, "Novità"). */
  badge?: ReactNode;
  /** The section's colour: the tile is tinted by it (and a collapse saturates toward it). Any hex. */
  color: string;
  /** `large` for the first tiles of a Bento (bigger media); Bento sets it with `layout="auto"`. */
  size?: 'large' | 'small';
  /** Inside `<Bento layout="auto">`: how big the section is (how many entries), shaping its span. */
  weight?: number;
  /** Illustration or photo, decorative. */
  children?: ReactNode;
}

export type TileProps<E extends ElementType = 'button'> = PolymorphicProps<E, TileOwnProps>;

/**
 * A cell of the entry grid, tinted by its own colour, with a slow drifting blob (moved only with `transform`).
 * Text and media scale with the tile (container units).
 */
export function Tile<E extends ElementType = 'button'>(props: TileProps<E>) {
  const {
    as,
    css,
    className,
    title,
    subtitle,
    badge,
    color,
    size = 'small',
    weight: _weight,
    children,
    style,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Tile', props as TileProps);
  const Root = (as ?? 'button') as ElementType;
  const styled = useCss('Tile', 'root', css);
  const { part, style: partsStyle } = useParts('Tile', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const vars = {
    '--slurp-tile-color': color,
    '--slurp-tile-on': /^#[0-9a-f]{6}$/i.test(color) ? onColor(color) : 'var(--slurp-fg)',
    '--slurp-animation-tint': color,
    ...style,
  } as CSSProperties;
  return (
    <>
      {styled.style}
      {partsStyle}
      <Root
        className={cx('slurp-tile', styled.className, className)}
        data-size={size}
        style={vars}
        {...(Root === 'button' ? { type: 'button' } : null)}
        {...root}
      >
        {part('blob', 'span', { className: 'slurp-tile-blob', 'aria-hidden': true })}
        {part('text', 'span', {
          className: 'slurp-tile-text',
          children: (
            <>
              {part('title', 'span', { className: 'slurp-tile-title', children: title })}
              {subtitle != null &&
                part('subtitle', 'span', { className: 'slurp-tile-subtitle', children: subtitle })}
            </>
          ),
        })}
        {badge != null && part('badge', 'span', { className: 'slurp-tile-badge', children: badge })}
        {children != null &&
          part('media', 'span', { className: 'slurp-tile-media', 'aria-hidden': true, children })}
      </Root>
    </>
  );
}
