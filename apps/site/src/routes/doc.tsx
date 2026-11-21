import { MDXProvider } from '@mdx-js/react';
import {
  Contents,
  Dock,
  Flow,
  ResultRow,
  Settings,
  SkipLink,
  Surface,
  Text,
  matchesAll,
  Prose,
  useMediaQuery,
  useSlurpEnter,
  useSlurpNavigate,
} from '@slurp-ui/react';
import apiIndex from 'virtual:slurp-api-index';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { LANGS, REPO, type Lang } from '../../site.config';
import { SiteFooter } from '~/components/SiteFooter';
import { Brand } from '~/components/Brand';
import { EditIcon, MenuIcon } from '@slurp-ui/react/icons';
import { mdxComponents } from '~/components/Mdx';
import { PageNav } from '~/components/PageNav';
import { SideNav } from '~/components/SideNav';
import { AVAILABLE } from '~/lib/available';
import { useHeadings } from '~/lib/headings';
import { COPY } from '~/lib/i18n';
import { href, useLang } from '~/lib/lang';
import { motionIds } from '~/lib/link';
import { API_SECTION, NAV, pageTitle, sectionOf } from '~/lib/nav';

/** Below this width the two indexes leave the sides and open from the Dock. */
const NARROW = '(max-width: 1100px)';

/** What the section pages read from the Dock: the search filters their list. */
export interface SectionContext {
  query: string;
  /** Empties the search ("Azzera la ricerca"). */
  reset: () => void;
}

interface Hit {
  to: string;
  title: string;
  meta: string;
}

type Panel = 'index' | 'toc' | null;

/**
 * Every page of the site, in Slurp's terms with mui.com's reading skeleton: the index of the documentation in a
 * floating Surface on the left, the page's own index on the right, and the Dock at the bottom carrying the path and
 * the global search. On narrow screens both indexes open from the Dock as its panels. Settings at the top right.
 */
export default function DocLayout() {
  const { lang, copy, slug } = useLang();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const narrow = useMediaQuery(NARROW);
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState<Panel>(null);
  const first = useRef(true);

  const parts = slug.split('/').filter(Boolean);
  const level = parts.length === 0 ? 'home' : parts.length === 1 ? 'section' : 'page';
  const api = parts[0] === API_SECTION.id;
  const section = api ? API_SECTION : sectionOf(slug);
  const sectionTitle = section?.title[lang];
  const title =
    level !== 'page'
      ? sectionTitle
      : api
        ? copy.apiTitle(moduleName(parts[1]))
        : pageTitle(slug, lang);

  // A new place: the search and the panels start again, focus goes to the title (not on the first load or an anchor).
  const [place, setPlace] = useState(pathname);
  if (place !== pathname) {
    setPlace(pathname);
    setQuery('');
    setPanel(null);
  }
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!hash) document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  const headings = useHeadings();

  // Above the title, where the page sits (tailwindcss.com's breadcrumb line): "Componenti · Azioni".
  const groups = section && 'groups' in section ? section.groups : [];
  const group = groups.find((g) => g.pages.some((p) => p.slug === slug));
  const eyebrow =
    level !== 'page'
      ? undefined
      : [sectionTitle, group && groups.length > 1 ? group.title[lang] : null]
          .filter(Boolean)
          .join(' · ');

  // The Dock's search looks everywhere, like mui.com's: pages and APIs, results in the Dock's panel.
  const hits = useMemo<Hit[]>(() => {
    const q = query.trim();
    if (!q) return [];
    const pages = NAV.flatMap((s) =>
      s.groups.flatMap((g) =>
        g.pages
          .filter((p) => AVAILABLE.has(`${lang}/${p.slug}`))
          .map((p) => ({
            to: href(lang, p.slug),
            title: p.title?.[lang] ?? p.slug,
            meta: s.groups.length > 1 ? `${s.title[lang]} · ${g.title[lang]}` : s.title[lang],
          })),
      ),
    );
    const modules = [...new Set(apiIndex.map((c) => c.module))].map((m) => ({
      to: href(lang, `api/${m.toLowerCase()}`),
      title: copy.apiTitle(m),
      meta: API_SECTION.title[lang],
    }));
    return [...pages, ...modules].filter((h) => matchesAll(`${h.title} ${h.meta}`, q));
  }, [query, lang, copy]);

  // Collapse / expand between the levels (grid → list → page): going back, the crumb you leave bursts into the
  // items of the level you return to, the one you came from first. Forward collapses start in landing and section.
  const go = useSlurpNavigate(navigate);
  const up = () => {
    if (level === 'page' && section)
      void go(href(lang, section.id), {
        from: motionIds.pageCrumb(slug),
        lead: motionIds.row(slug),
      });
    else if (section)
      void go(href(lang, ''), {
        from: motionIds.sectionCrumb(section.id),
        lead: motionIds.tile(section.id),
      });
  };
  // A page arriving from its section's list: the rows land on its crumb, the article fades in.
  const article = useRef<HTMLElement>(null);
  useSlurpEnter(undefined, { key: level === 'page' ? pathname : null, content: article });

  const showToc = level === 'page' && headings.length > 1;
  const searching = query.trim() !== '';
  const toggle = (p: Exclude<Panel, null>) => setPanel((now) => (now === p ? null : p));

  const outlet = <Outlet context={{ query, reset: () => setQuery('') } satisfies SectionContext} />;

  return (
    <>
      {title && level !== 'home' && <title>{`${title} · Slurp UI`}</title>}
      <SkipLink />
      <Settings
        languages={LANGS.map((l: Lang) => ({ value: l, label: COPY[l].languageName, lang: l }))}
        language={lang}
        onLanguageChange={(to) => {
          const keep = level !== 'page' || api || AVAILABLE.has(`${to}/${slug}`);
          void navigate(href(to as Lang, keep ? slug : ''));
        }}
      />
      <Brand />

      {level === 'home' ? (
        <main id="content" className="site-home" tabIndex={-1}>
          {outlet}
        </main>
      ) : (
        <div className="site-shell" data-toc={showToc || undefined}>
          {!narrow && (
            <div className="site-side site-side-left">
              <Surface className="site-float">
                <SideNav />
              </Surface>
            </div>
          )}
          <main id="content" className="site-content" tabIndex={-1}>
            {level === 'page' ? (
              <Prose as="article" className="site-article" ref={article}>
                {eyebrow && <p className="site-eyebrow">{eyebrow}</p>}
                <MDXProvider components={mdxComponents}>{outlet}</MDXProvider>
                <a
                  className="site-edit slurp-link"
                  href={
                    api
                      ? `${REPO}/blob/main/packages/ui/src/${moduleName(parts[1])}/${moduleName(parts[1])}.tsx`
                      : `${REPO}/edit/main/apps/site/src/content/${lang}/${slug}.mdx`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <EditIcon size={18} />
                  {api ? copy.source : copy.editOnGithub}
                </a>
                <PageNav available={AVAILABLE} />
              </Prose>
            ) : (
              outlet
            )}
          </main>
          {!narrow && showToc && (
            <div className="site-side site-side-right">
              <Surface className="site-float">
                <Contents
                  items={headings.map((h) => ({ id: h.id, label: h.text, level: h.level }))}
                />
              </Surface>
            </div>
          )}
        </div>
      )}
      <SiteFooter />

      <Dock
        panelLabel={
          searching ? copy.searchResults : panel === 'toc' ? copy.pageMenu : copy.docsIndex
        }
        focusPanel={!searching}
        onDismiss={() => {
          setPanel(null);
          setQuery('');
        }}
        panel={
          searching ? (
            hits.length ? (
              <Flow gap={1}>
                {hits.slice(0, 6).map((h) => (
                  <ResultRow
                    key={h.to}
                    title={h.title}
                    meta={h.meta}
                    onClick={() => void navigate(h.to)}
                  />
                ))}
                {hits.length > 6 && (
                  <Text font="caption" className="site-more">
                    {copy.items(hits.length)}
                  </Text>
                )}
              </Flow>
            ) : (
              <Text muted className="site-empty">
                {copy.noResults}
              </Text>
            )
          ) : panel === 'index' ? (
            <SideNav onNavigate={() => setPanel(null)} />
          ) : panel === 'toc' ? (
            <Flow gap={1} as="nav" aria-label={copy.pageMenu}>
              {headings.map((h) => (
                <ResultRow
                  key={h.id}
                  title={h.text}
                  className="site-toc-row"
                  data-level={h.level}
                  onClick={() => {
                    setPanel(null);
                    document.getElementById(h.id)?.scrollIntoView({ block: 'start' });
                    history.replaceState(null, '', `#${h.id}`);
                  }}
                />
              ))}
            </Flow>
          ) : null
        }
      >
        {level !== 'home' && (
          <Dock.Crumbs>
            <Dock.Back onClick={up} />
            {level === 'page' && section && (
              <Dock.Crumb animationId={motionIds.sectionCrumb(section.id)} onClick={up}>
                {sectionTitle}
              </Dock.Crumb>
            )}
            <Dock.Crumb
              current
              animationId={
                level === 'page'
                  ? motionIds.pageCrumb(slug)
                  : section && motionIds.sectionCrumb(section.id)
              }
              // Narrow screens: the page's index opens from its crumb (on wide ones it sits on the right).
              expanded={narrow && showToc ? panel === 'toc' : undefined}
              onClick={narrow && showToc ? () => toggle('toc') : undefined}
            >
              {title}
            </Dock.Crumb>
          </Dock.Crumbs>
        )}
        <Dock.Search value={query} onValueChange={setQuery} placeholder={copy.searchAll} />
        {narrow && level !== 'home' && (
          <Dock.Actions>
            <Dock.Action
              label={copy.docsIndex}
              expanded={panel === 'index'}
              onClick={() => toggle('index')}
            >
              <MenuIcon />
            </Dock.Action>
          </Dock.Actions>
        )}
      </Dock>
    </>
  );
}

function moduleName(param: string | undefined): string {
  return apiIndex.find((c) => c.module.toLowerCase() === param)?.module ?? param ?? '';
}
