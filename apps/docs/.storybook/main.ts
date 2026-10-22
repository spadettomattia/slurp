import { createRequire } from 'node:module';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);
// pnpm keeps dependencies isolated: resolve addons and the framework from this package, not from the hoisted root.
const abs = (pkg: string) => path.dirname(require.resolve(`${pkg}/package.json`));

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [abs('@storybook/addon-docs'), abs('@storybook/addon-a11y')],
  framework: { name: abs('@storybook/react-vite'), options: {} },
  core: { disableTelemetry: true },
};

export default config;
