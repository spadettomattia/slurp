import { PageNav as SlurpPageNav } from '@slurp-ui/react';
import type { ComponentProps } from 'react';

import { href, useLang } from '~/lib/lang';
import { useLinkProps } from '~/lib/link';
import { PAGES } from '~/lib/nav';

/** A router link for the library's PageNav: a real href with the base path, and in-app navigation. */
function RouterLink({ to, ...rest }: { to: string } & ComponentProps<'a'>) {
  return <a {...rest} {...useLinkProps(to)} />;
}

/** Previous / next page in reading order, at the end of the article (only pages that exist in this language). */
export function PageNav({ available }: { available: Set<string> }) {
  const { lang, slug } = useLang();
  const pages = PAGES.filter((p) => available.has(`${lang}/${p.slug}`));
  const at = pages.findIndex((p) => p.slug === slug);
  if (at < 0) return null;
  const prev = pages[at - 1];
  const next = pages[at + 1];
  return (
    <SlurpPageNav
      className="site-steps"
      linkAs={RouterLink}
      previous={prev && { title: prev.title?.[lang] ?? '', to: href(lang, prev.slug) }}
      next={next && { title: next.title?.[lang] ?? '', to: href(lang, next.slug) }}
    />
  );
}
