import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { Plugin } from 'vite';

// Anatomy of every component, read from its CSS at build time: the docs cannot drift from the styles.
// Each `.slurp-*` class goes to the component whose name is its longest prefix (`slurp-list-row-title` →
// ListRow, not List); a rule's custom properties and attribute selectors go with the classes it styles.

export interface ComponentAnatomy {
  /** `.slurp-*` classes: the root first, then the parts. */
  classes: string[];
  /** The class on the component's root element, when it has one of its own. */
  root: string | null;
  /** Custom properties the component declares, with their first (default) value. */
  vars: { name: string; value: string }[];
  /** State hooks: `data-*` and `aria-*` attribute selectors. */
  states: string[];
}

const ID = 'virtual:slurp-anatomy';
const RESOLVED = `\0${ID}`;

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Leaf rules of a stylesheet (nested at-rules flattened): selector text and declarations. */
function rules(css: string): { selector: string; body: string }[] {
  const out: { selector: string; body: string }[] = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const stack: number[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      stack.push(i);
    } else if (ch === '}') {
      const open = stack.pop();
      if (open === undefined) continue;
      const body = text.slice(open + 1, i);
      if (!body.includes('{')) {
        const head = text.slice(start, open);
        // Cut after the enclosing at-rule's brace (`@layer … {`) or the previous statement.
        const cut = Math.max(head.lastIndexOf(';'), head.lastIndexOf('}'), head.lastIndexOf('{'));
        const selector = head.slice(cut + 1).trim();
        if (!selector.startsWith('@')) out.push({ selector, body });
      }
      start = i + 1;
    } else if (ch === ';' && !stack.length) {
      start = i + 1;
    }
  }
  return out;
}

export function readAnatomy(
  srcDir: string,
  tokenNames: Set<string>,
): Record<string, ComponentAnatomy> {
  const dirs = readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^[A-Z]/.test(d.name))
    .map((d) => d.name);
  const owners = dirs
    .map((name) => ({ name, prefix: `slurp-${kebab(name)}` }))
    .sort((a, b) => b.prefix.length - a.prefix.length);
  const ownerOf = (cls: string) =>
    owners.find((o) => cls === o.prefix || cls.startsWith(`${o.prefix}-`))?.name;

  const result: Record<string, ComponentAnatomy> = {};
  // Defaults come from the root rule (`.slurp-button`), not from a variant that overrides them.
  const fromRoot = new Set<string>();
  const entry = (name: string) =>
    (result[name] ??= { classes: [], root: null, vars: [], states: [] });

  for (const dir of dirs) {
    for (const file of readdirSync(path.join(srcDir, dir)).filter((f) => f.endsWith('.css'))) {
      for (const { selector, body } of rules(readFileSync(path.join(srcDir, dir, file), 'utf8'))) {
        const classes = [...selector.matchAll(/\.(slurp-[a-z0-9-]+)/g)].map((m) => m[1] ?? '');
        const names = [...new Set(classes.map(ownerOf).filter((n): n is string => !!n))];
        if (!names.length) continue;
        const own = names[0] ?? dir;
        for (const cls of classes) {
          const name = ownerOf(cls);
          if (name && !entry(name).classes.includes(cls)) entry(name).classes.push(cls);
        }
        for (const m of selector.matchAll(
          /\[((?:data|aria)-[a-z-]+)(?:=['"]?([^'"\]]+)['"]?)?\]/g,
        )) {
          // The page's theme is context, not a state of the component.
          if (m[1] === 'data-theme') continue;
          const state = m[2] ? `${m[1]}="${m[2]}"` : (m[1] ?? '');
          if (!entry(own).states.includes(state)) entry(own).states.push(state);
        }
        const root = selector === `.slurp-${kebab(own)}`;
        for (const m of body.matchAll(/(--slurp-[a-z0-9-]+)\s*:\s*([^;]+)/g)) {
          const name = m[1] ?? '';
          if (tokenNames.has(name)) continue;
          const value = (m[2] ?? '').trim().replace(/\s+/g, ' ');
          const key = `${own} ${name}`;
          const known = entry(own).vars.find((v) => v.name === name);
          if (!known) entry(own).vars.push({ name, value });
          else if (root && !fromRoot.has(key)) known.value = value;
          if (root) fromRoot.add(key);
        }
      }
    }
  }
  for (const [name, a] of Object.entries(result)) {
    const root = `slurp-${kebab(name)}`;
    a.classes.sort((x, y) => Number(y === root) - Number(x === root));
    a.root = a.classes.includes(root) ? root : null;
    a.states.sort();
  }
  return result;
}

/** Serves `virtual:slurp-anatomy` (a JSON map by component name) and reloads it when a CSS file changes. */
export function anatomyPlugin(srcDir: string, tokensCss: string): Plugin {
  const tokenNames = () =>
    new Set(
      [...readFileSync(tokensCss, 'utf8').matchAll(/(--slurp-[a-z0-9-]+)\s*:/g)].map(
        (m) => m[1] ?? '',
      ),
    );
  return {
    name: 'slurp-anatomy',
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null;
      return `export default ${JSON.stringify(readAnatomy(srcDir, tokenNames()))};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.css') || !path.resolve(file).startsWith(path.resolve(srcDir))) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
}
