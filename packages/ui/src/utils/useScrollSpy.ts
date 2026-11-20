import { useEffect, useState } from 'react';

export interface UseScrollSpyOptions {
  /**
   * Band of the viewport where a heading counts as "being read", as an IntersectionObserver rootMargin. Default the
   * top 35%: `0px 0px -65% 0px`.
   */
  rootMargin?: string;
}

/**
 * The id, among `ids`, of the section being read: the first of those elements inside the reading band. Stays on the
 * last one seen while you scroll through a long section. `undefined` until one shows (and during SSR).
 */
export function useScrollSpy(
  ids: readonly string[],
  { rootMargin = '0px 0px -65% 0px' }: UseScrollSpyOptions = {},
): string | undefined {
  const [active, setActive] = useState<string>();
  const key = ids.join('\u0000');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = key
      .split('\u0000')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) visible.set(r.target.id, r.isIntersecting);
        const first = els.find((el) => visible.get(el.id));
        if (first) setActive(first.id);
      },
      { rootMargin },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [key, rootMargin]);
  return active;
}
