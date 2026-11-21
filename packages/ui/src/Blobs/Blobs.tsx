import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface BlobsOwnProps {
  /** How many blobs, 1–5. Default 3. */
  count?: number;
  /** A colour for the blobs. Default the accent. */
  color?: string;
}

export type BlobsProps<E extends ElementType = 'div'> = PolymorphicProps<E, BlobsOwnProps>;

/**
 * Ambient blobs: slow drifting radial gradients behind the content of the parent (which needs `position: relative`).
 * Decorative: hidden from assistive technologies, never take the pointer, move only with `transform` and stand still
 * with reduced motion.
 */
export function Blobs<E extends ElementType = 'div'>(props: BlobsProps<E>) {
  const {
    as,
    css,
    className,
    count = 3,
    color,
    style,
    ...rest
  } = useThemeProps('Blobs', props as BlobsProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Blobs', 'root', css);
  const root = useAnimationRoot(rest);
  const n = Math.min(5, Math.max(1, Math.round(count)));
  return (
    <>
      {styled.style}
      <Root
        aria-hidden="true"
        className={cx('slurp-blobs', styled.className, className)}
        style={color ? ({ ...style, '--slurp-blob': color } as CSSProperties) : style}
        {...root}
      >
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className="slurp-blob" />
        ))}
      </Root>
    </>
  );
}
