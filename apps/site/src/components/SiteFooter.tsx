import { Footer, Surface } from '@slurp-ui/react';
import { Link } from 'react-router';

import { REPO } from '../../site.config';
import { href, useLang } from '~/lib/lang';
import { AVAILABLE } from '~/lib/available';
import { API_SECTION, NAV } from '~/lib/nav';

/** The components a visitor looks for first: the foot shows these, the rest is one link away. */
const FEATURED_COMPONENTS = ['button', 'field', 'dialog', 'table', 'dock', 'toast'];

/**
 * The foot of every page, as tailwindcss.com keeps it — quiet: three link columns (the sections, the components people
 * look for, the project) and the copyright. The frequent questions are not here: under a page of documentation they
 * would read as part of it; they are a section of the home. Links to pages that exist.
 */
export function SiteFooter() {
  const { lang, copy } = useLang();
  const f = copy.footer;
  const sections = [
    ...NAV.filter((s) =>
      s.groups.some((g) => g.pages.some((p) => AVAILABLE.has(`${lang}/${p.slug}`))),
    ).map((s) => ({ id: s.id, title: s.title[lang] })),
    { id: API_SECTION.id, title: API_SECTION.title[lang] },
  ];
  const components = FEATURED_COMPONENTS.filter((n) => AVAILABLE.has(`${lang}/components/${n}`));
  const allComponents = lang === 'it' ? 'Tutti i componenti' : 'All components';
  return (
    <div className="site-footer">
      <Surface className="site-footer-card">
        <Footer aria-label={f.label}>
          <Footer.Group title={f.docs}>
            {sections.map((c) => (
              <Footer.Link key={c.id} as={Link} to={href(lang, c.id)}>
                {c.title}
              </Footer.Link>
            ))}
          </Footer.Group>
          <Footer.Group title={f.popular}>
            {components.map((n) => (
              <Footer.Link key={n} as={Link} to={href(lang, `components/${n}`)}>
                {n.charAt(0).toUpperCase() + n.slice(1)}
              </Footer.Link>
            ))}
            <Footer.Link as={Link} to={href(lang, 'components')}>
              {allComponents}
            </Footer.Link>
          </Footer.Group>
          <Footer.Group title={f.project}>
            <Footer.Link href={REPO} target="_blank" rel="noreferrer">
              GitHub
            </Footer.Link>
            <Footer.Link href={`${REPO}/releases`} target="_blank" rel="noreferrer">
              {f.releases}
            </Footer.Link>
            <Footer.Link href={`${REPO}/issues`} target="_blank" rel="noreferrer">
              {f.issues}
            </Footer.Link>
            <Footer.Link href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
              {f.license}
            </Footer.Link>
          </Footer.Group>
          <Footer.Bottom>
            <span>{f.rights(new Date().getFullYear())}</span>
          </Footer.Bottom>
        </Footer>
      </Surface>
    </div>
  );
}
