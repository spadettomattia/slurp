// Texts of the components, per language. Not an i18n system: every component keeps its Italian defaults and its
// `labels` prop; a SlurpProvider can swap them all at once with a preset ('en') or an object.
import type { CarouselLabels } from '../Carousel/Carousel';
import type { ChoiceLabels } from '../Choice/Choice';
import type { DialogLabels } from '../Dialog/Dialog';
import type { DockLabels } from '../Dock/Dock';
import type { FiltersLabels } from '../Filters/Filters';
import type { NoticeLabels } from '../Notice/Notice';
import type { PagesLabels } from '../Pages/Pages';
import type { RatingLabels } from '../Rating/Rating';
import type { SearchLabels } from '../Search/Search';
import type { SettingsLabels } from '../Settings/Settings';
import type { StepsLabels } from '../Steps/Steps';
import type { SuggestLabels } from '../Suggest/Suggest';
import type { TableLabels } from '../Table/Table';
import type { ToastLabels } from '../Toast/Toast';

/** The texts of every component that has some, by component. Dialog's also apply to Sheet. */
export interface SlurpLabels {
  Carousel?: Partial<CarouselLabels>;
  Choice?: Partial<ChoiceLabels>;
  Dialog?: Partial<DialogLabels>;
  Dock?: Partial<DockLabels>;
  Filters?: Partial<FiltersLabels>;
  Notice?: Partial<NoticeLabels>;
  Pages?: Partial<PagesLabels>;
  Rating?: Partial<RatingLabels>;
  Search?: Partial<SearchLabels>;
  Settings?: Partial<SettingsLabels>;
  Steps?: Partial<StepsLabels>;
  Suggest?: Partial<SuggestLabels>;
  Table?: Partial<TableLabels>;
  Toast?: Partial<ToastLabels>;
}

/** A built-in language (a plain string, so a server component can pass it) or your own texts. */
export type LabelsInput = 'it' | 'en' | SlurpLabels;

/** English texts for every component. Italian is the components' own default. */
export const labelsEn = {
  Carousel: {
    previous: 'Previous',
    next: 'Next',
    slide: (i, n) => `${i} of ${n}`,
    show: (i, n) => `Show ${i} of ${n}`,
    picker: 'Choose what to show',
  },
  Choice: { placeholder: 'Choose…' },
  Dialog: { close: 'Close' },
  Dock: {
    navigation: 'Navigation',
    crumbs: 'Path',
    back: 'Back',
    search: 'Search',
    searchPlaceholder: 'Search…',
    noResults: 'No results',
    matches: (i, n) => `${n === 1 ? '1 match' : `${n} matches`}, ${i} of ${n}`,
    nextMatch: (i, n) => `Go to the next match: ${i} of ${n}`,
    resultsHint: 'Arrow down to browse the results, Escape to close them.',
  },
  Filters: { title: 'Filters', reset: 'Reset filters' },
  Notice: {
    neutral: 'Note',
    success: 'Done',
    warning: 'Warning',
    danger: 'Error',
    dismiss: 'Dismiss notice',
  },
  Pages: {
    label: 'Pages',
    previous: 'Previous page',
    next: 'Next page',
    page: (n) => `Page ${n}`,
    status: (n, count) => `${n} of ${count}`,
  },
  Rating: {
    value: (v, max) => `${v} out of ${max}`,
    star: (n) => (n === 1 ? '1 star' : `${n} stars`),
  },
  Search: {
    label: 'Search',
    placeholder: 'Search…',
    clear: 'Clear the search',
    results: (n) => (n === 0 ? 'No results' : n === 1 ? '1 result' : `${n} results`),
  },
  Settings: {
    open: 'Settings',
    close: 'Close settings',
    title: 'Settings',
    theme: 'Theme',
    system: 'Automatic',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
  },
  Steps: { label: 'Steps', done: 'completed' },
  Suggest: {
    results: (n) => (n === 1 ? '1 suggestion' : `${n} suggestions`),
    empty: 'No suggestions',
  },
  Table: { empty: 'No items' },
  Toast: { region: 'Notifications', dismiss: 'Dismiss notification' },
} satisfies Required<SlurpLabels>;

/** Italian, the components' own defaults: nothing to swap. */
export const labelsIt: SlurpLabels = {};

/** Resolves a provider's `labels` prop to texts by component. */
export function resolveLabels(input: LabelsInput | undefined): SlurpLabels | undefined {
  if (input === undefined) return undefined;
  if (input === 'en') return labelsEn;
  if (input === 'it') return labelsIt;
  return input;
}
