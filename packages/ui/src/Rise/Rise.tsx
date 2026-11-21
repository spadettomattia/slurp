import { cx } from '@slurp-ui/utils';
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useForkRef } from '../utils/useForkRef';

export interface RiseOwnProps {
  /** Milliseconds to wait once it is due: step a row of siblings by 60 each (`index * 60`). Default 0. */
  delay?: number;
  children?: ReactNode;
}

export type RiseProps<E extends ElementType = 'div'> = PolymorphicProps<E, RiseOwnProps>;

/**
 * Reveals what it wraps when it scrolls into view: it rises 32px and fades in over 650ms, once. Reduced motion: a
 * plain fade. Without script or `IntersectionObserver` it is simply there. Do not wrap the hero (it has its own
 * entrance) or anything that appears again and again.
 */
export function Rise<E extends ElementType = 'div'>(props: RiseProps<E>) {
  const {
    as,
    css,
    className,
    delay = 0,
    style,
    children,
    ref,
    ...rest
  } = useThemeProps('Rise', props as RiseProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Rise', 'root', css);
  const own = useRef<HTMLElement>(null);
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, own as never) });

  useEffect(() => {
    const el = own.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    el.setAttribute('data-armed', '');
    const watch = new IntersectionObserver(
      (entries) => {
        // In view, or already scrolled past (a jump, the End key): either way it is due.
        const due = (e: IntersectionObserverEntry) =>
          e.isIntersecting || (e.rootBounds != null && e.boundingClientRect.top < e.rootBounds.top);
        if (!entries.some(due)) return;
        el.setAttribute('data-in', '');
        watch.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    watch.observe(el);
    return () => {
      watch.disconnect();
      el.removeAttribute('data-armed');
      el.removeAttribute('data-in');
    };
  }, []);

  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-rise', styled.className, className)}
        style={delay ? ({ ...style, '--slurp-rise-delay': `${delay}ms` } as CSSProperties) : style}
        {...root}
      >
        {children}
      </Root>
    </>
  );
}
