import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

const ARTICLE = '.site-article';

/** The h2 / h3 of the article (its DOM: read once painted and whenever it changes). */
export function useHeadings(): Heading[] {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  useEffect(() => {
    const article = document.querySelector(ARTICLE);
    if (!article) return;
    const sync = () =>
      setHeadings(
        [...article.querySelectorAll<HTMLElement>(':is(h2, h3)[id]')].map((h) => ({
          id: h.id,
          text: h.textContent ?? '',
          level: h.tagName === 'H2' ? 2 : 3,
        })),
      );
    const frame = requestAnimationFrame(sync);
    const mo = new MutationObserver(sync);
    mo.observe(article, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
    };
  }, [pathname]);
  return headings;
}
