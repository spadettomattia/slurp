// API reference of every component, read from the TypeScript types of @slurp-ui/react (react-docgen-typescript).
// Served as `virtual:slurp-api`; also used by react-router.config.ts to prerender one API page per component.
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { withCustomConfig, type ComponentDoc } from 'react-docgen-typescript';
import type { Plugin } from 'vite';

import { highlight } from './highlight.ts';

const ui = fileURLToPath(new URL('../../../packages/ui', import.meta.url));
const src = path.join(ui, 'src');

export interface ApiProp {
  name: string;
  type: string;
  /** The literal values of a union type (`"fill" | "soft"`), when the type names an alias (`Appearance`). */
  values?: string;
  required: boolean;
  default?: string;
  description: string;
  /** Where it comes from: the component itself, or a shared group (motion, parts, css…). */
  group: 'own' | 'base' | 'parts' | 'animation' | 'input';
}

export interface ApiComponent {
  name: string;
  /** Folder under packages/ui/src: the subpath import (`@slurp-ui/react/<module>`). */
  module: string;
  description: string;
  props: ApiProp[];
}

/** Folders of packages/ui/src that hold components (one `<Name>/<Name>.tsx` with a capitalised name). */
export function componentModules(): string[] {
  return readdirSync(src, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^[A-Z]/.test(d.name))
    .filter((d) => existsSync(path.join(src, d.name, `${d.name}.tsx`)))
    .map((d) => d.name)
    .sort();
}

const GROUP: Record<string, ApiProp['group']> = {
  BaseProps: 'base',
  PartsProps: 'parts',
  AnimationProps: 'animation',
  // The native input's attributes, forwarded as they are (Field, Search, Suggest).
  InputAttributes: 'input',
};

/** "Default `md`." / "Default 300." at the end of a JSDoc line becomes the default column. */
function splitDefault(text: string): { description: string; default?: string } {
  // Only plain values (`md`, 300, 0.5, true): a phrase ("Default the first step") stays in the description.
  const m = /(?:^|\s)Default:? (`[^`]+`|-?\d+(?:\.\d+)?|true|false)\.(?=\s|$)/.exec(text);
  if (!m) return { description: text.trim() };
  return {
    description: (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim(),
    default: m[1]?.replace(/^`|`$/g, ''),
  };
}

/** `"fill" | "soft" | …` for a union of literals (docgen reports it as an enum), else nothing. */
function literals(type: { name: string; value?: unknown }): string | undefined {
  if (type.name !== 'enum' || !Array.isArray(type.value)) return undefined;
  const values = (type.value as { value: string }[]).map((v) => v.value);
  if (!values.length || values.some((v) => !/^["'\d]|^(true|false)$/.test(v))) return undefined;
  return values.join(' | ');
}

function toApi(doc: ComponentDoc, module: string): ApiComponent {
  const props: ApiProp[] = Object.values(doc.props)
    .map((p) => {
      const { description, default: fromText } = splitDefault(p.description ?? '');
      const fromCode = p.defaultValue?.value as string | undefined;
      return {
        name: p.name,
        type: p.type.raw && p.type.raw.length < 160 ? p.type.raw : p.type.name,
        values: literals(p.type),
        required: p.required,
        default: fromCode ?? fromText,
        description,
        group: GROUP[p.parent?.name ?? ''] ?? 'own',
      } satisfies ApiProp;
    })
    // Own props first (required first), then the shared ones; alphabetical inside.
    .sort(
      (a, b) =>
        Number(a.group !== 'own') - Number(b.group !== 'own') ||
        Number(b.required) - Number(a.required) ||
        a.name.localeCompare(b.name),
    );
  return { name: doc.displayName, module, description: doc.description.trim(), props };
}

/** Every exported component with its props. A few seconds: the TypeScript program of the whole package. */
export function readApi(): ApiComponent[] {
  const parser = withCustomConfig(path.join(ui, 'tsconfig.json'), {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    // Props declared by the library only: the HTML attributes forwarded to the root are not listed one by one.
    propFilter: (p) => !p.parent || p.parent.fileName.includes('packages/ui/src'),
  });
  const modules = componentModules();
  const docs = parser.parse(modules.map((m) => path.join(src, m, `${m}.tsx`)));
  return (
    docs
      // `Menu.Item` repeats `MenuItem`: keep the named export.
      .filter((d) => /^[A-Z]\w*$/.test(d.displayName))
      .map((d) => {
        const file = (d as ComponentDoc & { filePath?: string }).filePath ?? '';
        const module = path.basename(path.dirname(file)) || d.displayName;
        return toApi(d, module);
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  );
}

const ID = 'virtual:slurp-api';
/** Only the names (search, navigation): `[{ name, module }]`, without the props. */
const INDEX = 'virtual:slurp-api-index';

export function apiPlugin(): Plugin {
  let cache: ApiComponent[] | null = null;
  const api = () => (cache ??= readApi());
  return {
    name: 'slurp-api',
    resolveId: (id) => (id === ID || id === INDEX ? `\0${id}` : null),
    async load(id) {
      if (id === `\0${ID}`) {
        // The import lines of each module, highlighted like every other snippet of the site.
        const imports: Record<string, string> = {};
        for (const module of new Set(api().map((c) => c.module))) {
          const names = api()
            .filter((c) => c.module === module)
            .map((c) => c.name)
            .join(', ');
          imports[module] = await highlight(
            `import { ${names} } from '@slurp-ui/react';\n// or, this module only:\nimport { ${names} } from '@slurp-ui/react/${module}';`,
            'tsx',
          );
        }
        return `export default ${JSON.stringify(api())};\nexport const imports = ${JSON.stringify(imports)};`;
      }
      if (id === `\0${INDEX}`)
        return `export default ${JSON.stringify(
          api().map(({ name, module, description }) => ({
            name,
            module,
            // The first sentence: the one line of the API cards.
            summary: /^[^.:]*[.:]?/.exec(description)?.[0].replace(/[.:]$/, '') ?? '',
          })),
        )};`;
      return null;
    },
    handleHotUpdate({ file }) {
      if (file.startsWith(src) && file.endsWith('.tsx')) cache = null;
    },
  };
}
