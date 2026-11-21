import { cx } from '@slurp-ui/utils';
import { Fragment, useEffect, useRef, type ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useForkRef } from '../utils/useForkRef';

export interface RevealOwnProps {
  /** The sentence: plain text, at least two lines at 680px. The line breaks are chosen by the browser. */
  children: string;
}

export type RevealProps<E extends ElementType = 'p'> = PolymorphicProps<E, RevealOwnProps>;

/** Milliseconds between words that light up together, and the most the whole batch waits. */
const STEP = 30;
const CAP = 400;

/**
 * A large sentence whose words go from the secondary colour to the full one, one at a time, as they cross a line at
 * 65% of the viewport height while the page scrolls. Colour only: nothing moves. Once lit a word stays lit; at the
 * end of the page whatever is still dim lights up, so no word stays dim for good. Reduced motion, no script and no
 * `IntersectionObserver`: the sentence is simply lit.
 */
export function Reveal<E extends ElementType = 'p'>(props: RevealProps<E>) {
  const { as, css, className, children, ref, ...rest } = useThemeProps(
    'Reveal',
    props as RevealProps,
  );
  const Root = (as ?? 'p') as ElementType;
  const styled = useCss('Reveal', 'root', css);
  const own = useRef<HTMLElement>(null);
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, own as never) });

  useEffect(() => {
    const el = own.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    const words = [...el.querySelectorAll<HTMLElement>('.slurp-reveal-word')];
    const dim = () => words.filter((w) => !w.hasAttribute('data-lit'));
    const light = (list: HTMLElement[]) =>
      list.forEach((w, i) => {
        w.style.transitionDelay = `${Math.min(i * STEP, CAP)}ms`;
        w.setAttribute('data-lit', '');
      });
    el.setAttribute('data-armed', '');

    const crossed = new IntersectionObserver(
      (entries) => {
        const batch = entries
          .filter(
            (e) =>
              e.isIntersecting ||
              (e.rootBounds != null && e.boundingClientRect.top < e.rootBounds.top),
          )
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => words.indexOf(a) - words.indexOf(b));
        light(batch);
        batch.forEach((w) => crossed.unobserve(w));
      },
      { rootMargin: '0px 0px -35% 0px' },
    );
    words.forEach((w) => crossed.observe(w));

    // The page cannot scroll further: whatever is still dim lights up (checked once per frame, only while dim).
    let frame = 0;
    const atEnd = () => {
      frame = 0;
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) light(dim());
    };
    const onScroll = () => {
      if (!frame && dim().length) frame = requestAnimationFrame(atEnd);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      crossed.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      el.removeAttribute('data-armed');
      words.forEach((w) => {
        w.removeAttribute('data-lit');
        w.style.transitionDelay = '';
      });
    };
  }, [children]);

  return (
    <>
      {styled.style}
      <Root className={cx('slurp-reveal', styled.className, className)} {...root}>
        {children.split(' ').map((word, i) => (
          <Fragment key={i}>
            {i > 0 && ' '}
            <span className="slurp-reveal-word">{word}</span>
          </Fragment>
        ))}
      </Root>
    </>
  );
}
