import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

/** Marks the active `mark.slurp-mark` inside root and scrolls it to the middle; returns how many there are. */
export function focusHit(root: HTMLElement | null, index: number, smooth = true): number {
  const hits = root ? [...root.querySelectorAll<HTMLElement>('mark.slurp-mark')] : [];
  const current = hits.length ? hits[((index % hits.length) + hits.length) % hits.length] : null;
  for (const m of hits) {
    if (m === current) m.dataset.active = '';
    else delete m.dataset.active;
  }
  current?.scrollIntoView?.({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
  return hits.length;
}

export interface FindInPage {
  /** Matches found in the root (the `Mark`s rendered for the query). */
  count: number;
  /** The active match, 0-based. */
  index: number;
  /** Next (+1) or previous (−1) match, looping: Enter / Shift+Enter, or a tap on the counter. */
  step: (delta: 1 | -1) => void;
}

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Find in page: render the page's text through `<Mark text query />`, pass the same query here. The active match is
 * filled and scrolled to the middle; a new query starts again from the first match.
 */
export function useFindInPage(root: RefObject<HTMLElement | null>, query: string): FindInPage {
  const [state, setState] = useState({ query, index: 0 });
  const [count, setCount] = useState(0);
  const index = state.query === query ? state.index : 0;
  if (state.query !== query) setState({ query, index: 0 });

  useLayoutEffect(() => {
    // The matches are the marks just rendered: they can only be counted from the DOM after the commit.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(query.trim() ? focusHit(root.current, index, !reduced()) : 0);
  }, [root, query, index]);

  const step = useCallback(
    (delta: 1 | -1) =>
      setState((s) => ({ ...s, index: count ? (((s.index + delta) % count) + count) % count : 0 })),
    [count],
  );
  return { count, index: count ? index : 0, step };
}
