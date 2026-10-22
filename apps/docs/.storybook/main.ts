import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const require = createRequire(import.meta.url);
// pnpm keeps dependencies isolated: resolve addons and the framework from this package, not from the hoisted root.
const abs = (pkg: string) => path.dirname(require.resolve(`${pkg}/package.json`));

// Stories read @slurp/ui from its sources: edits show up with HMR, no rebuild needed.
const uiSrc = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../packages/ui/src',
);

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [abs('@storybook/addon-docs'), abs('@storybook/addon-a11y')],
  framework: { name: abs('@storybook/react-vite'), options: {} },
  core: { disableTelemetry: true },
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: [
          { find: /^@slurp\/ui$/, replacement: path.join(uiSrc, 'index.ts') },
          { find: /^@slurp\/ui\/styles\.css$/, replacement: path.join(uiSrc, 'styles.css') },
          { find: /^@slurp\/ui\/([A-Za-z]+)$/, replacement: path.join(uiSrc, '$1', 'index.ts') },
        ],
      },
    }),
};

export default config;
