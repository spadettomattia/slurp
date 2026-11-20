import { cx } from '@slurp-ui/utils';
import { useState, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

export interface MediaOwnProps extends PartsProps<'frame' | 'media' | 'caption'> {
  /** Image (or video with `video`) URL. */
  src: string;
  /** What the picture shows; `""` for a purely decorative one. Ignored for a video (name it with a caption). */
  alt?: string;
  /** Width / height: `'16/9'` (default), `'4/3'`, `'1/1'`, any CSS ratio or a number. */
  ratio?: string | number;
  /** `cover` (default) crops to fill the frame; `contain` shows it all. */
  fit?: 'cover' | 'contain';
  /** A video with native controls instead of an image. */
  video?: boolean;
  /** Still shown before a video plays. */
  poster?: string;
  /** Below the frame. */
  caption?: ReactNode;
  /** `lazy` (default) waits until it is near the viewport; `eager` for the first picture of a page. */
  loading?: 'lazy' | 'eager';
}

export type MediaProps<E extends ElementType = 'figure'> = PolymorphicProps<E, MediaOwnProps>;

/**
 * A picture or a video in a frame with fixed proportions and the design system's radius: the space is kept while it
 * loads (no layout shift), with a soft placeholder until the first frame shows.
 */
export function Media<E extends ElementType = 'figure'>(props: MediaProps<E>) {
  const {
    as,
    css,
    className,
    src,
    alt = '',
    ratio = '16/9',
    fit = 'cover',
    video = false,
    poster,
    caption,
    loading = 'lazy',
    parts,
    partProps,
    classNames,
    style: styleProp,
    ...rest
  } = useThemeProps('Media', props as MediaProps);
  const [loaded, setLoaded] = useState(false);
  const Root = (as ?? 'figure') as ElementType;
  const styled = useCss('Media', 'root', css);
  const { part, style } = useParts('Media', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const aspect = typeof ratio === 'number' ? String(ratio) : ratio.replace(/\s*\/\s*/, ' / ');
  const done = () => setLoaded(true);
  return (
    <>
      {styled.style}
      {style}
      <Root className={cx('slurp-media', styled.className, className)} style={styleProp} {...root}>
        {part('frame', 'div', {
          className: 'slurp-media-frame',
          'data-loaded': loaded || undefined,
          style: { aspectRatio: aspect },
          children: video
            ? part('media', 'video', {
                className: 'slurp-media-el',
                src,
                poster,
                controls: true,
                preload: 'metadata',
                playsInline: true,
                'data-fit': fit,
                onLoadedData: done,
                onError: done,
              })
            : part('media', 'img', {
                className: 'slurp-media-el',
                src,
                alt,
                loading,
                decoding: 'async',
                'data-fit': fit,
                onLoad: done,
                onError: done,
              }),
        })}
        {caption != null &&
          part('caption', 'figcaption', { className: 'slurp-media-caption', children: caption })}
      </Root>
    </>
  );
}
