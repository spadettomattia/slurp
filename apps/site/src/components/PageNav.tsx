import { ChevronLeftIcon, ChevronRightIcon } from '@slurp-ui/icons';
import { Button } from '@slurp-ui/react';

import { href, useLang } from '~/lib/lang';
import { useLinkProps } from '~/lib/link';
import { PAGES } from '~/lib/nav';

function Step({
  to,
  dir,
  label,
  title,
}: {
  to: string;
  dir: 'prev' | 'next';
  label: string;
  title: string;
}) {
  return (
    <Button
      {...useLinkProps(to)}
      appearance="soft"
      tone="neutral"
      size="lg"
      className="site-step"
      data-dir={dir}
      icon={dir === 'prev' ? <ChevronLeftIcon /> : undefined}
      endIcon={dir === 'next' ? <ChevronRightIcon /> : undefined}
    >
      <span className="site-step-label">{label}</span>
      <span className="site-step-title">{title}</span>
    </Button>
  );
}

/** Previous / next page in reading order, at the end of the article (only pages that exist in this language). */
export function PageNav({ available }: { available: Set<string> }) {
  const { lang, copy, slug } = useLang();
  const pages = PAGES.filter((p) => available.has(`${lang}/${p.slug}`));
  const at = pages.findIndex((p) => p.slug === slug);
  if (at < 0) return null;
  const prev = pages[at - 1];
  const next = pages[at + 1];
  return (
    <nav className="site-steps" aria-label={`${copy.previous} / ${copy.next}`}>
      {prev && (
        <Step
          to={href(lang, prev.slug)}
          dir="prev"
          label={copy.previous}
          title={prev.title?.[lang] ?? ''}
        />
      )}
      {next && (
        <Step
          to={href(lang, next.slug)}
          dir="next"
          label={copy.next}
          title={next.title?.[lang] ?? ''}
        />
      )}
    </nav>
  );
}
