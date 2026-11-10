import {
  AnimationGroup,
  Button,
  Empty,
  Flow,
  List,
  Text,
  matchesAll,
  useSlurpEnter,
} from '@slurp-ui/react';
import apiIndex from 'virtual:slurp-api-index';
import { useRef } from 'react';
import { useOutletContext, useParams } from 'react-router';

import { RowLink } from '~/components/Links';
import { AVAILABLE } from '~/lib/available';
import { href, useLang } from '~/lib/lang';
import { motionIds } from '~/lib/link';
import { API_SECTION, NAV } from '~/lib/nav';
import type { SectionContext } from './doc';
import NotFound from './not-found';

interface Entry {
  slug: string;
  to: string;
  title: string;
  description?: string;
}

/** A section: its pages as lists of rows, grouped; the Dock's search filters them as you type. */
export default function Section() {
  const { lang, copy } = useLang();
  const { section: id } = useParams();
  const { query, reset } = useOutletContext<SectionContext>();
  const summary = (m: string) => apiIndex.find((c) => c.name === m || c.module === m)?.summary;
  const intro = useRef<HTMLDivElement>(null);
  // From the home: the handoff lands on this section's crumb (in the Dock) and the page fades in. Back from a page:
  // its crumb bursts into the rows, the page's own row first. Replayed when only the section changes.
  useSlurpEnter({ group: motionIds.rows }, { key: id, content: intro });

  const nav = NAV.find((s) => s.id === id);
  const head = nav ?? (id === API_SECTION.id ? API_SECTION : null);
  if (!head) return <NotFound />;

  const groups: { title?: string; entries: Entry[] }[] = nav
    ? nav.groups.map((g) => ({
        title: nav.groups.length > 1 ? g.title[lang] : undefined,
        entries: g.pages
          .filter((p) => AVAILABLE.has(`${lang}/${p.slug}`))
          .map((p) => ({
            slug: p.slug,
            to: href(lang, p.slug),
            title: p.title?.[lang] ?? p.slug,
            description: id === 'components' ? summary(p.title?.en ?? '') : undefined,
          })),
      }))
    : [
        {
          entries: [...new Set(apiIndex.map((c) => c.module))].map((m) => ({
            slug: `api/${m.toLowerCase()}`,
            to: href(lang, `api/${m.toLowerCase()}`),
            title: m,
            description: summary(m),
          })),
        },
      ];

  const q = query.trim();
  const shown = groups
    .map((g) => ({
      ...g,
      entries: g.entries.filter((e) => !q || matchesAll(`${e.title} ${e.description ?? ''}`, q)),
    }))
    .filter((g) => g.entries.length > 0);
  const total = shown.reduce((n, g) => n + g.entries.length, 0);

  return (
    <>
      <Flow gap={2} className="site-hero" ref={intro}>
        <Text font="title-xl" as="h1" tabIndex={-1}>
          {head.title[lang]}
        </Text>
        <Text font="body-l" muted>
          {head.subtitle[lang]}
        </Text>
        <Text font="caption" role="status">
          {copy.items(total)}
        </Text>
      </Flow>
      {total === 0 ? (
        <Empty
          title={copy.noResults}
          action={
            <Button appearance="soft" onClick={reset}>
              {copy.resetSearch}
            </Button>
          }
        />
      ) : (
        <AnimationGroup id={motionIds.rows}>
          {shown.map((g, i) => (
            <section key={g.title ?? i} className="site-group">
              {g.title && (
                <Text font="title-l" as="h2">
                  {g.title}
                </Text>
              )}
              <List>
                {g.entries.map((e) => (
                  <RowLink
                    key={e.to}
                    to={e.to}
                    animationId={motionIds.row(e.slug)}
                    slurp={{
                      from: { group: motionIds.rows },
                      lead: motionIds.row(e.slug),
                      to: motionIds.pageCrumb(e.slug),
                    }}
                    title={e.title}
                    meta={e.description}
                    actionLabel={copy.open}
                  />
                ))}
              </List>
            </section>
          ))}
        </AnimationGroup>
      )}
    </>
  );
}
