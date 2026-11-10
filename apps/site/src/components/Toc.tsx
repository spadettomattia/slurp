import { useEffect, useState } from 'react';

import type { Heading } from '~/lib/headings';
import { useLang } from '~/lib/lang';

/** "On this page": the article's headings, the one being read marked while scrolling (`aria-current`). */
export function Toc({ headings }: { headings: Heading[] }) {
  const { copy } = useLang();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) visible.set(r.target.id, r.isIntersecting);
        const first = els.find((el) => visible.get(el.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '0px 0px -65% 0px' },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;
  return (
    <nav className="site-toc" aria-label={copy.pageMenu}>
      <p className="site-toc-title">{copy.onThisPage}</p>
      <ul>
        {headings.map((h) => (
          <li key={h.id} data-level={h.level}>
            <a href={`#${h.id}`} aria-current={h.id === active ? 'location' : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
