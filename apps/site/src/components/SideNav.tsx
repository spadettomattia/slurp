import { Fold } from '@slurp-ui/react';
import apiIndex from 'virtual:slurp-api-index';
import { NavLink } from 'react-router';

import { AVAILABLE } from '~/lib/available';
import { href, useLang } from '~/lib/lang';
import { API_SECTION, NAV } from '~/lib/nav';

/**
 * The index of the whole documentation (mui.com's drawer, in Slurp's terms): one Fold per section, the one you are in
 * open; the current page is a soft pill with an accent-ink bar and `aria-current="page"`.
 */
export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { lang, copy, slug } = useLang();
  const here = slug.split('/')[0];
  const link = (to: string, label: string) => (
    <li key={to}>
      <NavLink to={href(lang, to)} end className="site-nav-link" onClick={onNavigate}>
        {label}
      </NavLink>
    </li>
  );
  const modules = [...new Set(apiIndex.map((c) => c.module))];
  return (
    <nav className="site-nav" aria-label={copy.docsIndex}>
      {NAV.map((s) => {
        const groups = s.groups
          .map((g) => ({ ...g, pages: g.pages.filter((p) => AVAILABLE.has(`${lang}/${p.slug}`)) }))
          .filter((g) => g.pages.length > 0);
        if (!groups.length) return null;
        return (
          <Fold
            key={s.id}
            summary={s.title[lang]}
            defaultOpen={s.id === here}
            headingLevel={2}
            className="site-nav-fold"
          >
            {groups.map((g) => (
              <div key={g.title.en} className="site-nav-group">
                {groups.length > 1 && <p className="site-nav-group-title">{g.title[lang]}</p>}
                <ul>{g.pages.map((p) => link(p.slug, p.title?.[lang] ?? p.slug))}</ul>
              </div>
            ))}
          </Fold>
        );
      })}
      <Fold
        summary={API_SECTION.title[lang]}
        defaultOpen={here === API_SECTION.id}
        headingLevel={2}
        className="site-nav-fold"
      >
        <ul>{modules.map((m) => link(`api/${m.toLowerCase()}`, m))}</ul>
      </Fold>
    </nav>
  );
}
