import { createIcon } from '@slurp-ui/icons';

// Icons of the site's own chrome, drawn with the design system's icon builder (24×24, 2px stroke, round caps).
export const LinkIcon = createIcon('LinkIcon', [
  'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1',
  'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
]);
export const CodeIcon = createIcon('CodeIcon', ['M9 8l-4 4 4 4', 'M15 8l4 4-4 4']);
export const MenuIcon = createIcon('MenuIcon', ['M4 7h16', 'M4 12h16', 'M4 17h10']);
// The repository: a branch (two commits and a merge), not a brand logo.
export const RepoIcon = createIcon('RepoIcon', [
  [6, 5, 2],
  [6, 19, 2],
  [18, 7, 2],
  'M6 7v10',
  'M18 9a6 6 0 0 1-6 6H8',
]);
export const PauseIcon = createIcon('PauseIcon', ['M9 6v12', 'M15 6v12']);
export const PlayIcon = createIcon('PlayIcon', ['M8 5.5v13l10-6.5z']);
