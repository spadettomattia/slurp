import { cx } from '@slurp-ui/utils';
import { useState, type ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface AvatarOwnProps {
  /** Who it is: the image's alt text and the source of the initials. */
  name: string;
  /** Photo; when missing or broken, the initials show. */
  src?: string;
  /** `sm` 32 · `md` 44 (default) · `lg` 64. */
  size?: 'sm' | 'md' | 'lg';
  /** Next to the visible name already: hidden from assistive tech. */
  decorative?: boolean;
}

export type AvatarProps<E extends ElementType = 'span'> = PolymorphicProps<E, AvatarOwnProps>;

/** First letters of the first and last word. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : '';
  return (first + last).toLocaleUpperCase();
}

/** A person (or a brand): round photo, initials when there is none. */
export function Avatar<E extends ElementType = 'span'>(props: AvatarProps<E>) {
  const {
    as,
    css,
    className,
    name,
    src,
    size = 'md',
    decorative = false,
    ...rest
  } = useThemeProps('Avatar', props as AvatarProps);
  const [failed, setFailed] = useState<string | null>(null);
  const Root = (as ?? 'span') as ElementType;
  const styled = useCss('Avatar', 'root', css);
  const root = useAnimationRoot(rest);
  const photo = src && failed !== src;
  const a11y = decorative
    ? { 'aria-hidden': true }
    : photo
      ? {}
      : { role: 'img', 'aria-label': name };
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-avatar', styled.className, className)}
        data-size={size}
        {...a11y}
        {...root}
      >
        {photo ? (
          <img src={src} alt={decorative ? '' : name} onError={() => setFailed(src)} />
        ) : (
          <span aria-hidden="true">{initials(name)}</span>
        )}
      </Root>
    </>
  );
}
