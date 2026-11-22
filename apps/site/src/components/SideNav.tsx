import { Rail } from '@slurp-ui/react';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router';

import { AVAILABLE } from '~/lib/available';
import { href, useLang } from '~/lib/lang';
import { API_SECTION, NAV } from '~/lib/nav';

/**
 * The index of the whole documentation, as tailwindcss.com lays it out: every section open at once, each under its
 * own heading, its groups under a small title, the pages as quiet links; the current page is a soft pill with an
 * accent-ink outline and `aria-current="page"`. The API sits at the end as one link: its modules live on its own page.
 */
export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { lang, copy, slug } = useLang();
  const root = useRef<HTMLElement>(null);
  const link = (to: string, label: string, end = true) => (
    <Rail.Link key={to} as={NavLink} to={href(lang, to)} end={end} onClick={onNavigate}>
      {label}
    </Rail.Link>
  );

  // The page you are on comes into view in a long list, without moving the page itself.
  useEffect(() => {
    const here = root.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = root.current?.closest<HTMLElement>('[data-site-scroll]');
    if (!here || !box) return;
    const h = here.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (h.top < b.top || h.bottom > b.bottom) box.scrollTop += h.top - b.top - b.height / 3;
  }, [slug]);

  return (
    <Rail className="site-nav" label={copy.docsIndex} ref={root}>
      {NAV.map((s) => {
        const groups = s.groups
          .map((g) => ({ ...g, pages: g.pages.filter((p) => AVAILABLE.has(`${lang}/${p.slug}`)) }))
          .filter((g) => g.pages.length > 0);
        if (!groups.length) return null;
        return (
          <section key={s.id} className="site-nav-section" aria-labelledby={`nav-${s.id}`}>
            <h2 id={`nav-${s.id}`} className="site-nav-title">
              {s.title[lang]}
            </h2>
            {groups.map((g) => (
              <Rail.Group key={g.title.en} title={groups.length > 1 ? g.title[lang] : undefined}>
                {g.pages.map((p) => link(p.slug, p.title?.[lang] ?? p.slug))}
              </Rail.Group>
            ))}
          </section>
        );
      })}
      <section className="site-nav-section">
        <Rail.Group>{link(API_SECTION.id, API_SECTION.title[lang], false)}</Rail.Group>
      </section>
    </Rail>
  );
}
