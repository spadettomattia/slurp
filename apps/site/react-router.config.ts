import type { Config } from '@react-router/dev/config';

import { componentModules } from './plugins/api.ts';
import { BASE, LANGS, SECTIONS } from './site.config.ts';

// Static site: every URL is prerendered to its own HTML file (GitHub Pages), then the app takes over in the browser.
export default {
  appDirectory: 'src',
  basename: BASE,
  ssr: false,
  async prerender({ getStaticPaths }) {
    const api = componentModules().flatMap((m) => LANGS.map((l) => `/${l}/api/${m.toLowerCase()}`));
    const sections = SECTIONS.flatMap((s) => LANGS.map((l) => `/${l}/${s}`));
    return [...getStaticPaths(), ...sections, ...api];
  },
} satisfies Config;
