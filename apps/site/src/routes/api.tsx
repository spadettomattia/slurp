import { Table, type TableColumn } from '@slurp-ui/react';
import api, { imports } from 'virtual:slurp-api';
import anatomy from 'virtual:slurp-anatomy';
import { Link, useParams } from 'react-router';

import type { ComponentAnatomy } from '../../../docs/.storybook/anatomy';
import type { ApiComponent, ApiProp } from '../../plugins/api';
import { REPO } from '../../site.config';
import { AVAILABLE } from '~/lib/available';
import { inline } from '~/lib/inline';
import { href, useLang } from '~/lib/lang';
import { PAGES } from '~/lib/nav';
import NotFound from './not-found';

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/** API reference of one module (like mui.com/material-ui/api/…): import, props, CSS classes, source. */
export default function ApiPage() {
  const { lang, copy } = useLang();
  const { module: param = '' } = useParams();
  const components = api.filter((c) => c.module.toLowerCase() === param);
  const main = components.find((c) => c.name === components[0]?.module) ?? components[0];
  if (!main) return <NotFound />;
  const module = main.module;
  const page = PAGES.find(
    (p) => p.slug === `components/${module.toLowerCase()}` || p.title?.en === main.name,
  );

  const columns: TableColumn<ApiProp>[] = [
    {
      key: 'name',
      header: copy.prop,
      rowHeader: true,
      cell: (p) => (
        <span className="site-prop-name">
          <code>{p.name}</code>
          {p.required && <span className="site-prop-required">{copy.required}</span>}
        </span>
      ),
    },
    {
      key: 'type',
      header: copy.type,
      cell: (p) => <code className="site-prop-type">{p.type}</code>,
    },
    {
      key: 'default',
      header: copy.default,
      cell: (p) => (p.default ? <code>{p.default}</code> : '—'),
    },
    { key: 'description', header: copy.description, cell: (p) => inline(p.description) },
  ];

  return (
    <>
      <title>{`${copy.apiTitle(main.name)} · Slurp UI`}</title>
      <h1 tabIndex={-1}>{copy.apiTitle(main.name)}</h1>
      <p className="site-lead">{inline(main.description)}</p>
      {page && AVAILABLE.has(`${lang}/${page.slug}`) && (
        <p>
          <Link className="slurp-link" to={href(lang, page.slug)}>
            {copy.demos}: {main.name}
          </Link>
        </p>
      )}

      <h2 id="import">{copy.import}</h2>
      <div className="site-code" data-lang="tsx">
        <div dangerouslySetInnerHTML={{ __html: imports[module] ?? '' }} />
      </div>

      {components.map((c: ApiComponent) => {
        const own = c.props.filter((p) => p.group === 'own');
        const parts = c.props.find((p) => p.name === 'parts');
        const partNames = parts ? [...parts.type.matchAll(/"([a-zA-Z]+)"/g)].map((m) => m[1]) : [];
        const a: ComponentAnatomy | undefined = anatomy[c.name];
        const single = components.length === 1;
        return (
          <section key={c.name} aria-labelledby={`${anchor(c.name)}-props`}>
            <h2 id={`${anchor(c.name)}-props`}>
              {single ? copy.props : `${c.name} · ${copy.props}`}
            </h2>
            {!single && c.description && <p>{inline(c.description)}</p>}
            {own.length > 0 && (
              <Table
                caption={`${c.name} · ${copy.props}`}
                hideCaption
                columns={columns}
                rows={own}
                rowKey={(p) => p.name}
                className="site-props"
              />
            )}
            <p className="site-note">
              {inline(copy.sharedPropsNote)}{' '}
              {c.props.some((p) => p.name === 'css') && (
                <>
                  <code>css</code> ·{' '}
                </>
              )}
              {partNames.length > 0 && (
                <>
                  <code>parts</code> / <code>partProps</code> / <code>classNames</code> (
                  {partNames.join(', ')}) ·{' '}
                </>
              )}
              {c.props.some((p) => p.group === 'animation') && <code>animation*</code>}
            </p>
            {c.props.some((p) => p.group === 'input') && (
              <p className="site-note">
                {copy.inputProps}{' '}
                {c.props
                  .filter((p) => p.group === 'input')
                  .map((p) => (
                    <code key={p.name}>{p.name}</code>
                  ))}
              </p>
            )}
            {a && (
              <>
                <h3 id={`${anchor(c.name)}-css`}>{copy.anatomy}</h3>
                <dl className="site-anatomy">
                  <dt>{copy.classes}</dt>
                  <dd>
                    {a.classes.map((k) => (
                      <code key={k}>.{k}</code>
                    ))}
                  </dd>
                  {a.vars.length > 0 && (
                    <>
                      <dt>{copy.variables}</dt>
                      <dd>
                        {a.vars.map((v) => (
                          <code key={v.name} title={v.value}>
                            {v.name}
                          </code>
                        ))}
                      </dd>
                    </>
                  )}
                  {a.states.length > 0 && (
                    <>
                      <dt>{copy.states}</dt>
                      <dd>
                        {a.states.map((s) => (
                          <code key={s}>{s}</code>
                        ))}
                      </dd>
                    </>
                  )}
                </dl>
              </>
            )}
          </section>
        );
      })}

      <h2 id="source">{copy.source}</h2>
      <p>
        <a
          className="slurp-link"
          href={`${REPO}/blob/main/packages/ui/src/${module}/${module}.tsx`}
          target="_blank"
          rel="noreferrer"
        >
          packages/ui/src/{module}/{module}.tsx
        </a>
      </p>
      {lang === 'it' && <p className="site-note">{copy.englishNote}</p>}
    </>
  );
}
