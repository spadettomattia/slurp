import { ChevronLeftIcon, ChevronRightIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  Children,
  Fragment,
  useEffect,
  useId,
  useRef,
  type ElementType,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { Bubble } from '../Bubble/Bubble';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface CarouselLabels {
  previous: string;
  next: string;
  /** Name of a slide ("2 di 5"). */
  slide: (index: number, count: number) => string;
  /** Name of the button of a slide ("Mostra 2 di 5"). */
  show: (index: number, count: number) => string;
  /** Name of the group of slide buttons. */
  picker: string;
}

export const CAROUSEL_LABELS: CarouselLabels = {
  previous: 'Precedente',
  next: 'Successiva',
  slide: (i, n) => `${i} di ${n}`,
  show: (i, n) => `Mostra ${i} di ${n}`,
  picker: 'Scegli cosa mostrare',
};

export interface CarouselOwnProps extends PartsProps<
  'track' | 'slide' | 'controls' | 'previous' | 'next' | 'dot'
> {
  /** What it shows ("Foto del prodotto"): the name of the carousel. */
  label: string;
  /** The slides: one per child (a Stage, an image…). */
  children: ReactNode;
  /** Slide shown, from 0. */
  index?: number;
  /** Default 0. */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Above this many slides the dots (44px targets each) become a "2 / 12" counter. Default 5, which fits a phone. */
  maxDots?: number;
  labels?: Partial<CarouselLabels>;
}

export type CarouselProps<E extends ElementType = 'section'> = PolymorphicProps<
  E,
  CarouselOwnProps
>;

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Slide nearest to the track's scroll position (-1 when the track has no layout). */
function visible(track: HTMLElement): number {
  const width = track.clientWidth;
  return width ? Math.round(Math.abs(track.scrollLeft) / width) : -1;
}

/**
 * Media carousel: one slide at a time on a scroll-snap track (swipe on touch, arrow keys on the focused track), with
 * previous / next and a dot per slide (the current one is a longer pill). It never moves by itself; hidden slides are
 * inert, the shown one is announced politely.
 */
export function Carousel<E extends ElementType = 'section'>(props: CarouselProps<E>) {
  const {
    as,
    css,
    className,
    label,
    children,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    maxDots = 5,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Carousel', props as CarouselProps);
  const labels = { ...CAROUSEL_LABELS, ...labelsProp };
  const slides = Children.toArray(children);
  const count = slides.length;
  const [raw, setIndex] = useControlled({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const index = Math.min(Math.max(0, count - 1), Math.max(0, raw));
  const trackId = `${useId()}-track`;
  /** Slide a programmatic scroll is heading to: the scroll events on the way do not change the index. */
  const heading = useRef<{ to: number; until: number } | null>(null);
  const Root = (as ?? 'section') as ElementType;
  const styled = useCss('Carousel', 'root', css);
  const { part, style } = useParts('Carousel', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);

  // The index changed (buttons, keys, a controlled value): bring that slide into view.
  useEffect(() => {
    const t = document.getElementById(trackId);
    if (!t || visible(t) === index) return;
    const slide = t.children[index] as HTMLElement | undefined;
    if (!slide) return;
    heading.current = { to: index, until: performance.now() + 1000 };
    t.scrollTo?.({ left: slide.offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
  }, [index, trackId]);

  const go = (to: number) => {
    const next = Math.min(count - 1, Math.max(0, to));
    if (next !== index) setIndex(next);
  };

  // Swipes and scrolling: the slide that snapped into view becomes the current one.
  const latest = useRef({ index, count, setIndex });
  useEffect(() => {
    latest.current = { index, count, setIndex };
  });
  useEffect(() => {
    const t = document.getElementById(trackId);
    if (!t) return;
    const onScroll = (e: Event) => {
      const at = visible(t);
      const h = heading.current;
      if (h) {
        if (at === h.to || e.timeStamp > h.until) heading.current = null;
        else return;
      }
      const { index: now, count: n, setIndex: set } = latest.current;
      if (at >= 0 && at < n && at !== now) set(at);
    };
    t.addEventListener('scroll', onScroll, { passive: true });
    return () => t.removeEventListener('scroll', onScroll);
  }, [trackId]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (step) go(index + (rtl ? -step : step));
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(count - 1);
    else return;
    e.preventDefault();
  };

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-carousel', styled.className, className)}
        aria-roledescription="carousel"
        aria-label={label}
        {...root}
      >
        {part('track', 'div', {
          id: trackId,
          className: 'slurp-carousel-track',
          tabIndex: 0,
          'aria-live': 'polite',
          onKeyDown,
          children: slides.map((s, i) => (
            <Fragment key={i}>
              {part('slide', 'div', {
                role: 'group',
                'aria-roledescription': 'slide',
                'aria-label': labels.slide(i + 1, count),
                className: 'slurp-carousel-slide',
                'data-current': i === index ? '' : undefined,
                inert: i !== index,
                children: s,
              })}
            </Fragment>
          )),
        })}
        {count > 1 &&
          part('controls', 'div', {
            className: 'slurp-carousel-controls',
            children: (
              <>
                {part('previous', Bubble, {
                  className: 'slurp-carousel-previous',
                  label: labels.previous,
                  appearance: 'soft',
                  disabled: index === 0,
                  onClick: () => go(index - 1),
                  children: <ChevronLeftIcon size={20} />,
                })}
                {count <= maxDots ? (
                  <div className="slurp-carousel-dots" role="group" aria-label={labels.picker}>
                    {slides.map((_, i) => (
                      <Fragment key={i}>
                        {part('dot', 'button', {
                          type: 'button',
                          className: 'slurp-carousel-dot',
                          'aria-label': labels.show(i + 1, count),
                          'aria-current': i === index ? 'true' : undefined,
                          onClick: () => go(i),
                        })}
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <span className="slurp-carousel-status" aria-hidden="true">
                    {index + 1} / {count}
                  </span>
                )}
                {part('next', Bubble, {
                  className: 'slurp-carousel-next',
                  label: labels.next,
                  appearance: 'soft',
                  disabled: index === count - 1,
                  onClick: () => go(index + 1),
                  children: <ChevronRightIcon size={20} />,
                })}
              </>
            ),
          })}
      </Root>
    </>
  );
}
