// Where the site is served: GitHub Pages of spadettomattia/slurp.
export const BASE = '/slurp/';
export const REPO = 'https://github.com/spadettomattia/slurp';
export const STORYBOOK = 'https://spadettomattia.github.io/slurp/storybook/';
export const LANGS = ['it', 'en'] as const;
export type Lang = (typeof LANGS)[number];
/** Section pages (`/<lang>/<section>`): the lists between the home grid and the pages. */
export const SECTIONS = [
  'getting-started',
  'components',
  'customization',
  'motion',
  'hooks',
  'api',
] as const;
