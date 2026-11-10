// Code highlighting at build time (shiki). The theme only emits CSS variables (`--shiki-token-*`): the site maps them
// to design-system tokens, so code follows the light / dark theme and the accent like everything else.
import type { Element, Root } from 'hast';
import {
  createCssVariablesTheme,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from 'shiki';
import { visit } from 'unist-util-visit';

const theme = createCssVariablesTheme({
  name: 'slurp',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

export const LANGS = ['tsx', 'ts', 'bash', 'css', 'json', 'html'] as const;
type Lang = (typeof LANGS)[number];

let instance: Promise<Highlighter> | null = null;

export function highlighter(): Promise<Highlighter> {
  instance ??= createHighlighter({ themes: [theme], langs: [...LANGS] });
  return instance;
}

const known = (lang: string | undefined): Lang =>
  (LANGS as readonly string[]).includes(lang ?? '') ? (lang as Lang) : 'tsx';

/** Highlighted HTML (`<pre class="shiki">…`) of a snippet. */
export async function highlight(code: string, lang?: string): Promise<string> {
  const h = await highlighter();
  return h.codeToHtml(code.replace(/\n$/, ''), {
    lang: known(lang) as BundledLanguage,
    theme: 'slurp',
  });
}

/** Rehype plugin: highlights the fenced code blocks of MDX pages (```tsx …```). */
export function rehypeHighlight() {
  return async (tree: Root) => {
    const h = await highlighter();
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const code = node.children[0];
      if (!code || code.type !== 'element' || code.tagName !== 'code') return;
      const cls = (code.properties.className as string[] | undefined) ?? [];
      const lang = cls.find((c) => c.startsWith('language-'))?.slice(9);
      const text = code.children.map((c) => (c.type === 'text' ? c.value : '')).join('');
      const hast = h.codeToHast(text.replace(/\n$/, ''), {
        lang: known(lang) as BundledLanguage,
        theme: 'slurp',
      });
      const pre = hast.children[0] as Element;
      pre.properties['data-lang'] = known(lang);
      // The raw text, for the copy button.
      pre.properties['data-code'] = text.replace(/\n$/, '');
      parent.children[index] = pre;
    });
  };
}
