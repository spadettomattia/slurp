import { fileURLToPath } from 'node:url';

import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';

import { anatomyPlugin } from '../docs/.storybook/anatomy.ts';
import { apiPlugin } from './plugins/api.ts';
import { demoPlugin } from './plugins/demo.ts';
import { rehypeHighlight } from './plugins/highlight.ts';
import { BASE } from './site.config.ts';

// Like the playground and Storybook, the site reads @slurp-ui/* from their sources: what it documents is the code.
const pkg = (p: string) => fileURLToPath(new URL(`../../packages/${p}`, import.meta.url));

export default defineConfig({
  base: BASE,
  plugins: [
    demoPlugin(),
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      }),
    },
    apiPlugin(),
    anatomyPlugin(pkg('ui/src'), pkg('tokens/src/generated/tokens.css')),
    reactRouter(),
  ],
  resolve: {
    alias: [
      { find: /^~\//, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
      { find: /^@demos\//, replacement: fileURLToPath(new URL('./src/demos/', import.meta.url)) },
      { find: /^@slurp-ui\/react$/, replacement: pkg('ui/src/index.ts') },
      { find: /^@slurp-ui\/react\/styles\.css$/, replacement: pkg('ui/src/styles.css') },
      { find: /^@slurp-ui\/react\/([A-Za-z]+)$/, replacement: pkg('ui/src/$1/index.ts') },
      { find: /^@slurp-ui\/motion$/, replacement: pkg('motion/src/index.ts') },
    ],
  },
});
