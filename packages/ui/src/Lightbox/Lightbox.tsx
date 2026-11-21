import { ChevronLeftIcon, ChevronRightIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import type { ElementType, KeyboardEvent } from 'react';

import { Bubble } from '../Bubble/Bubble';
import { Dialog } from '../Dialog/Dialog';
import { useLabels } from '../internal/labels';
import { useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface LightboxLabels {
  previous: string;
  next: string;
  /** "2 di 5", read when the picture changes. */
  position: (index: number, count: number) => string;
}

export const LIGHTBOX_LABELS: LightboxLabels = {
  previous: 'Immagine precedente',
  next: 'Immagine successiva',
  position: (i, n) => `${i} di ${n}`,
};

export interface LightboxOwnProps {
  images: LightboxImage[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The picture shown. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  labels?: Partial<LightboxLabels>;
}

export type LightboxProps<E extends ElementType = 'dialog'> = PolymorphicProps<E, LightboxOwnProps>;

/** A picture at full size in a modal (Dialog underneath): arrows or the buttons move through the set, Escape closes. */
export function Lightbox<E extends ElementType = 'dialog'>(props: LightboxProps<E>) {
  const {
    className,
    images,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    labels: labelsProp,
    ...rest
  } = useThemeProps('Lightbox', props as LightboxProps);
  const labels = { ...LIGHTBOX_LABELS, ...useLabels('Lightbox'), ...labelsProp };
  const [index, setIndex] = useControlled({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const n = images.length;
  const at = Math.min(Math.max(index, 0), Math.max(n - 1, 0));
  const image = images[at];
  const go = (step: number) => setIndex((at + step + n) % n);
  const keys = (e: KeyboardEvent) => {
    if (n < 2) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
    else if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
    else return;
    e.preventDefault();
  };
  if (!image) return null;
  return (
    <Dialog
      {...(rest as object)}
      className={cx('slurp-lightbox', className)}
      title={image.caption ?? image.alt}
      description={n > 1 ? labels.position(at + 1, n) : undefined}
      onKeyDown={keys}
    >
      <div className="slurp-lightbox-stage">
        {n > 1 && (
          <Bubble label={labels.previous} onClick={() => go(-1)} className="slurp-lightbox-prev">
            <ChevronLeftIcon />
          </Bubble>
        )}
        <img src={image.src} alt={image.alt} className="slurp-lightbox-image" />
        {n > 1 && (
          <Bubble label={labels.next} onClick={() => go(1)} className="slurp-lightbox-next">
            <ChevronRightIcon />
          </Bubble>
        )}
      </div>
    </Dialog>
  );
}
