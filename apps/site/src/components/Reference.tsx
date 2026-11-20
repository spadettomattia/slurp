import { Code, Link as SlurpLink, Table, type TableColumn } from '@slurp-ui/react';
import api from 'virtual:slurp-api';
import { Link } from 'react-router';

import type { ApiProp } from '../../plugins/api';
import { href, useLang } from '~/lib/lang';

/** How many props the quick reference shows before pointing to the API page. */
const SHOWN = 6;

const mainOf = (module: string) => {
  const components = api.filter((c: { module: string }) => c.module === module);
  return components.find((c: { name: string }) => c.name === module) ?? components[0];
};

/**
 * The quick reference at the top of a component page (tailwindcss.com's "Quick reference"): the component's own
 * props with their values and default, the first few, then the full API page.
 */
export function QuickRef({ module }: { module: string }) {
  const { lang, copy } = useLang();
  const main = mainOf(module);
  if (!main) return null;
  const own = main.props.filter((p: ApiProp) => p.group === 'own');
  const columns: TableColumn<ApiProp>[] = [
    {
      key: 'name',
      header: copy.prop,
      rowHeader: true,
      cell: (p) => <code>{p.name}</code>,
    },
    {
      key: 'type',
      header: copy.values,
      cell: (p) => <code className="site-prop-type">{p.values ?? p.type}</code>,
    },
    {
      key: 'default',
      header: copy.default,
      cell: (p) => (p.default ? <code>{p.default}</code> : '—'),
    },
  ];
  return (
    <div className="site-quickref">
      <Table
        caption={copy.quickRef}
        hideCaption
        columns={columns}
        rows={own.slice(0, SHOWN)}
        rowKey={(p) => p.name}
        className="site-props"
      />
      <p className="site-note">
        <SlurpLink as={Link} to={href(lang, `api/${module.toLowerCase()}`)}>
          {copy.allProps(own.length, main.name)}
        </SlurpLink>
      </p>
    </div>
  );
}

/** "Customising the theme": the same component restyled for a whole app with createTheme (tailwindcss.com's last section). */
export function ThemeSnippet({ module }: { module: string }) {
  const { copy } = useLang();
  const main = mainOf(module);
  const name = main?.name ?? module;
  const code = `import { createTheme, SlurpProvider } from '@slurp-ui/react';

const theme = createTheme({
  components: {
    ${name}: {
      // ${copy.themeDefaults}
      defaults: {},
      // ${copy.themeCss}
      css: { root: {} },
    },
  },
});

<SlurpProvider theme={theme}>{/* … */}</SlurpProvider>;`;
  return (
    <>
      <p>{copy.themeIntro(name)}</p>
      <Code className="site-code" code={code} filename="theme.tsx" language="tsx" />
    </>
  );
}
