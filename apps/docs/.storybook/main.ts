import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

import { anatomyPlugin } from './anatomy.ts';

const require = createRequire(import.meta.url);
// pnpm keeps dependencies isolated: resolve addons and the framework from this package, not from the hoisted root.
const abs = (pkg: string) => path.dirname(require.resolve(`${pkg}/package.json`));

// Stories read @slurp-ui/react and @slurp-ui/motion from their sources: edits show up with HMR, no rebuild needed.
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
      plugins: [anatomyPlugin(uiSrc, path.join(uiSrc, '../../tokens/src/generated/tokens.css'))],
      resolve: {
        alias: [
          { find: /^@slurp-ui\/react$/, replacement: path.join(uiSrc, 'index.ts') },
          { find: /^@slurp-ui\/react\/styles\.css$/, replacement: path.join(uiSrc, 'styles.css') },
          {
            find: /^@slurp-ui\/react\/([A-Za-z]+)$/,
            replacement: path.join(uiSrc, '$1', 'index.ts'),
          },
          {
            find: /^@slurp-ui\/motion$/,
            replacement: path.join(uiSrc, '../../motion/src/index.ts'),
          },
        ],
      },
    }),
};

export default config;
