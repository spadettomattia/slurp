import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

import { LANGS } from '../site.config';

const content = fileURLToPath(new URL('./content', import.meta.url));

/** MDX pages of a language: `components/button` for content/<lang>/components/button.mdx. */
function slugs(lang: string): string[] {
  const dir = path.join(content, lang);
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.slice(0, -4).split(path.sep).join('/'))
    .sort();
}

// One route per page and language, all inside the documentation layout; the API pages come from the types.
export default [
  index('routes/home.tsx'),
  layout('routes/doc.tsx', [
    // Grid → list → page, like every Slurp interface: the home tiles, a section's list, a page.
    ...LANGS.map((lang) => route(lang, 'routes/landing.tsx', { id: `${lang}/home` })),
    ...LANGS.map((lang) =>
      route(`${lang}/:section`, 'routes/section.tsx', { id: `${lang}/section` }),
    ),
    ...LANGS.flatMap((lang) =>
      slugs(lang).map((slug) =>
        route(`${lang}/${slug}`, `content/${lang}/${slug}.mdx`, { id: `${lang}/${slug}` }),
      ),
    ),
    route(':lang/api/:module', 'routes/api.tsx'),
  ]),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
