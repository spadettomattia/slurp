// The table of contents of the site, in reading order (like mui.com: getting started, components, customisation,
// API). Page slugs match the MDX files under content/<lang>/; the API pages are generated for every module.
import { hue } from '@slurp-ui/react/tokens';

import type { Lang } from '../../site.config';

type Text = Record<Lang, string>;

export interface NavPage {
  /** `components/button`: content/<lang>/components/button.mdx, URL /<lang>/components/button. */
  slug: string;
  /** Default: the component name (same in both languages). */
  title?: Text;
}

export interface NavGroup {
  title: Text;
  pages: NavPage[];
}

export interface NavSection {
  /** URL segment of the section (`/it/components`) and prefix of its page slugs. */
  id: string;
  title: Text;
  /** One line under the title on the home tile and the section page. */
  subtitle: Text;
  /** Tint of the section's tile and cards: a `hue-*` preset. */
  hue: keyof typeof hue;
  groups: NavGroup[];
}

const t = (it: string, en: string): Text => ({ it, en });
const comps = (...names: string[]): NavPage[] =>
  names.map((n) => ({ slug: `components/${n.toLowerCase()}`, title: { it: n, en: n } }));

export const NAV: NavSection[] = [
  {
    id: 'getting-started',
    title: t('Per iniziare', 'Getting started'),
    subtitle: t('Installazione e primi passi', 'Installation and first steps'),
    hue: 'violet',
    groups: [
      {
        title: t('Per iniziare', 'Getting started'),
        pages: [
          { slug: 'getting-started/overview', title: t('Panoramica', 'Overview') },
          { slug: 'getting-started/installation', title: t('Installazione', 'Installation') },
          { slug: 'getting-started/usage', title: t('Uso', 'Usage') },
          {
            slug: 'getting-started/frameworks',
            title: t('Vite, Next.js e router', 'Vite, Next.js and routers'),
          },
        ],
      },
    ],
  },
  {
    id: 'components',
    title: t('Componenti', 'Components'),
    subtitle: t('Esempi dal vivo e codice', 'Live examples and code'),
    hue: 'teal',
    groups: [
      {
        title: t('Fondamenta', 'Foundations'),
        pages: comps(
          'Ground',
          'Cell',
          'Flow',
          'Frame',
          'Surface',
          'Text',
          'AccentScope',
          'VisuallyHidden',
          'Portal',
          'Hairline',
          'SkipLink',
        ),
      },
      {
        title: t('Azioni', 'Actions'),
        pages: comps('Button', 'Bubble', 'Chip', 'Link', 'Segmented'),
      },
      {
        title: t('Form', 'Inputs'),
        pages: comps(
          'Field',
          'Search',
          'Suggest',
          'Choice',
          'Checkbox',
          'Radio',
          'Switch',
          'Range',
          'Rating',
          'Swatch',
          'NumberField',
          'SecretField',
          'PinField',
          'DateField',
          'Calendar',
          'FileDrop',
          'ErrorSummary',
          'MultiSuggest',
        ),
      },
      {
        title: t('Contenuti', 'Content'),
        pages: comps(
          'Prose',
          'Code',
          'Contents',
          'Media',
          'Tag',
          'Kbd',
          'Quote',
          'Footer',
          'Reveal',
          'Rise',
        ),
      },
      {
        title: t('Pannelli', 'Panels'),
        pages: comps('Bloom', 'Menu', 'Dialog', 'Sheet', 'Hint', 'Fold', 'Tabs', 'Consent'),
      },
      {
        title: t('Feedback', 'Feedback'),
        pages: comps('Notice', 'Toast', 'Progress', 'Placeholder', 'Count'),
      },
      {
        title: t('Dati e media', 'Data and media'),
        pages: comps(
          'Table',
          'Carousel',
          'Avatar',
          'AvatarGroup',
          'Timeline',
          'Compare',
          'Lightbox',
        ),
      },
      {
        title: t('Navigazione', 'Navigation'),
        pages: comps('Rail', 'PageNav', 'Pages', 'Steps', 'Tree'),
      },
      {
        title: t('Firma Slurp', 'Slurp signature'),
        pages: comps(
          'Tile',
          'Bento',
          'Card',
          'Shelf',
          'Stage',
          'Fact',
          'Score',
          'ListRow',
          'ResultRow',
          'Mark',
          'Empty',
          'Dock',
          'Settings',
          'Filters',
        ),
      },
    ],
  },
  {
    id: 'customization',
    title: t('Personalizzazione', 'Customization'),
    subtitle: t('Tema, prop css, variabili', 'Theme, css prop, variables'),
    hue: 'pink',
    groups: [
      {
        title: t('Personalizzazione', 'Customization'),
        pages: [
          { slug: 'customization/theme', title: t('Tema', 'Theme') },
          { slug: 'customization/css-prop', title: t('Prop css', 'The css prop') },
          {
            slug: 'customization/css-variables',
            title: t('Classi e variabili CSS', 'CSS classes and variables'),
          },
          { slug: 'customization/color', title: t('Colore e accento', 'Color and accent') },
          { slug: 'customization/dark-mode', title: t('Tema chiaro e scuro', 'Light and dark') },
          { slug: 'customization/labels', title: t('Testi e lingue', 'Copy and languages') },
          { slug: 'customization/tokens', title: t('Token', 'Tokens') },
        ],
      },
    ],
  },
  {
    id: 'motion',
    title: t('Animazione', 'Motion'),
    subtitle: t('Collapse / expand', 'Collapse / expand'),
    hue: 'orange',
    groups: [
      {
        title: t('Animazione', 'Motion'),
        pages: [
          { slug: 'motion/collapse-expand', title: t('Collapse / expand', 'Collapse / expand') },
          { slug: 'motion/routes', title: t('Navigazione tra route', 'Across routes') },
        ],
      },
    ],
  },
  {
    id: 'hooks',
    title: t('Hook e utility', 'Hooks and utilities'),
    subtitle: t('Focus, pannelli, ricerca', 'Focus, panels, search'),
    hue: 'sky',
    groups: [
      {
        title: t('Hook e utility', 'Hooks and utilities'),
        pages: [
          { slug: 'hooks/panels', title: t('Pannelli e focus', 'Panels and focus') },
          { slug: 'hooks/state', title: t('Stato e media query', 'State and media queries') },
          { slug: 'hooks/search', title: t('Ricerca nel testo', 'Text search') },
        ],
      },
    ],
  },
];

/** Every page in reading order (for previous / next). */
export const PAGES: NavPage[] = NAV.flatMap((s) => s.groups.flatMap((g) => g.pages));

export function pageTitle(slug: string, lang: Lang): string | undefined {
  return PAGES.find((p) => p.slug === slug)?.title?.[lang];
}

/** The section of a slug (`components/button` → components); API pages belong to the API section. */
export function sectionOf(slug: string): NavSection | undefined {
  const id = slug.split('/')[0];
  return NAV.find((s) => s.id === id);
}

/** The API reference: one generated page per module of the library. */
export const API_SECTION = {
  id: 'api',
  title: t('API', 'API'),
  subtitle: t(
    'Props, classi e variabili di ogni componente',
    'Props, classes and variables of every component',
  ),
  hue: 'blue',
} as const satisfies Omit<NavSection, 'groups'>;

/** Hex of a section's tint. */
export const tint = (h: keyof typeof hue): string => hue[h];
