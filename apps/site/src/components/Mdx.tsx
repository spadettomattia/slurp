import { Link as SlurpLink, Notice, type StatusTone } from '@slurp-ui/react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router';

import { useLang } from '~/lib/lang';
import { ApiLinks } from './ApiLinks';
import { CopyButton } from './Copy';
import { LinkIcon } from './icons';

/** h2 / h3 with a self link (ids come from rehype-slug). */
function heading(Tag: 'h2' | 'h3') {
  return function Heading({ id, children }: { id?: string; children?: ReactNode }) {
    return (
      <Tag id={id} className="site-heading">
        {children}
        {id && (
          <a className="site-anchor" href={`#${id}`} aria-hidden="true" tabIndex={-1}>
            <LinkIcon />
          </a>
        )}
      </Tag>
    );
  };
}

/** Internal links go through the router (`/it/...` → client navigation); external ones open as usual. */
function A({ href = '', children, ...rest }: ComponentProps<'a'>) {
  const { lang } = useLang();
  if (href.startsWith('/')) {
    const to = /^\/(it|en)\//.test(href) ? href : `/${lang}${href}`;
    return (
      <SlurpLink as={Link} to={to} {...rest}>
        {children}
      </SlurpLink>
    );
  }
  if (href.startsWith('#'))
    return (
      <SlurpLink href={href} {...rest}>
        {children}
      </SlurpLink>
    );
  return (
    <SlurpLink href={href} target="_blank" rel="noreferrer" {...rest}>
      {children}
    </SlurpLink>
  );
}

/** A highlighted block from a ```fence, with its copy button. */
function Pre(props: ComponentProps<'pre'> & { 'data-code'?: string; 'data-lang'?: string }) {
  const { 'data-code': code, 'data-lang': lang, ...rest } = props;
  return (
    <div className="site-code" data-lang={lang}>
      <pre {...rest} tabIndex={0} />
      {code != null && <CopyButton text={code} />}
    </div>
  );
}

function Table(props: ComponentProps<'table'>) {
  const { copy } = useLang();
  return (
    <div className="site-table" role="region" tabIndex={0} aria-label={copy.table}>
      <table {...props} />
    </div>
  );
}

/** Callouts in the pages: `<Callout tone="warning">…</Callout>`. */
export function Callout({
  tone = 'neutral',
  title,
  children,
}: {
  tone?: StatusTone;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Notice tone={tone} title={title} className="site-callout">
      {children}
    </Notice>
  );
}

/** The page title takes focus after a navigation (see the doc layout). */
function H1({ id, children }: { id?: string; children?: ReactNode }) {
  return (
    <h1 id={id} tabIndex={-1}>
      {children}
    </h1>
  );
}

export const mdxComponents = {
  h1: H1,
  h2: heading('h2'),
  h3: heading('h3'),
  a: A,
  pre: Pre,
  table: Table,
  Callout,
  ApiLinks,
};
