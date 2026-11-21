// Paths of the design system's icon set (24×24, 2px stroke). One export per icon: unused ones are tree-shaken.
import { createIcon } from './createIcon';

export const CheckIcon = createIcon('CheckIcon', ['M5 12.5l4.5 4.5L19 7.5']);
export const CloseIcon = createIcon('CloseIcon', ['M6 6l12 12', 'M18 6L6 18']);
export const MinusIcon = createIcon('MinusIcon', ['M6 12h12']);
export const ChevronDownIcon = createIcon('ChevronDownIcon', ['M6 9l6 6 6-6']);
export const ChevronLeftIcon = createIcon('ChevronLeftIcon', ['M15 6l-6 6 6 6']);
export const ChevronRightIcon = createIcon('ChevronRightIcon', ['M9 6l6 6-6 6']);
export const ArrowLeftIcon = createIcon('ArrowLeftIcon', ['M19 12H5', 'M11 18l-6-6 6-6']);
export const ArrowUpIcon = createIcon('ArrowUpIcon', ['M12 19V5', 'M6 11l6-6 6 6']);
export const ArrowDownIcon = createIcon('ArrowDownIcon', ['M12 5v14', 'M6 13l6 6 6-6']);
// Two arrows: a column that can be sorted either way.
export const SortIcon = createIcon('SortIcon', [
  'M8 19V5',
  'M4 9l4-4 4 4',
  'M16 5v14',
  'M12 15l4 4 4-4',
]);
// Outline by default; `fill="currentColor"` gives the filled star (a rating's chosen stars).
export const StarIcon = createIcon('StarIcon', [
  'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
]);
export const SearchIcon = createIcon('SearchIcon', [[11, 11, 7], 'M20 20l-3.5-3.5']);
export const FiltersIcon = createIcon('FiltersIcon', [
  'M4 7h10',
  'M18 7h2',
  'M4 17h4',
  'M12 17h8',
  [16, 7, 2],
  [10, 17, 2],
]);
export const ResetIcon = createIcon('ResetIcon', ['M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5']);
export const GearIcon = createIcon('GearIcon', [
  'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
  [12, 12, 3],
]);
export const SunIcon = createIcon('SunIcon', [
  [12, 12, 4],
  'M12 2v2',
  'M12 20v2',
  'M4.9 4.9l1.4 1.4',
  'M17.7 17.7l1.4 1.4',
  'M2 12h2',
  'M20 12h2',
  'M4.9 19.1l1.4-1.4',
  'M17.7 6.3l1.4-1.4',
]);
export const MoonIcon = createIcon('MoonIcon', ['M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z']);
export const AutoIcon = createIcon('AutoIcon', [[12, 12, 8], 'M12 4v16', 'M12 4a8 8 0 0 1 0 16z']);
// Status: shape and word together, never colour alone.
export const InfoIcon = createIcon('InfoIcon', [[12, 12, 9], 'M12 11v5', 'M12 8h.01']);
export const SuccessIcon = createIcon('SuccessIcon', [[12, 12, 9], 'M8 12.5l2.5 2.5L16 9.5']);
export const WarningIcon = createIcon('WarningIcon', [
  'M10.3 3.9L2.4 17.5a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  'M12 9v4',
  'M12 17h.01',
]);
export const ErrorIcon = createIcon('ErrorIcon', [[12, 12, 9], 'M15 9l-6 6', 'M9 9l6 6']);

// Everyday actions and objects, for any site (menu, edit, files, people, time, media).
export const MenuIcon = createIcon('MenuIcon', ['M4 7h16', 'M4 12h16', 'M4 17h10']);
export const PlusIcon = createIcon('PlusIcon', ['M12 5v14', 'M5 12h14']);
export const EditIcon = createIcon('EditIcon', [
  'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z',
  'M13.5 6.5l4 4',
]);
export const TrashIcon = createIcon('TrashIcon', [
  'M4 7h16',
  'M10 11v6',
  'M14 11v6',
  'M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12',
  'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
]);
// Two rounded sheets.
export const CopyIcon = createIcon('CopyIcon', [
  'M12 9h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z',
  'M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2',
]);
export const LinkIcon = createIcon('LinkIcon', [
  'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1',
  'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
]);
export const ExternalIcon = createIcon('ExternalIcon', [
  'M14 4h6v6',
  'M20 4l-9 9',
  'M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4',
]);
export const DownloadIcon = createIcon('DownloadIcon', ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14']);
export const UploadIcon = createIcon('UploadIcon', ['M12 15V4', 'M7 9l5-5 5 5', 'M5 20h14']);
export const CodeIcon = createIcon('CodeIcon', ['M9 8l-4 4 4 4', 'M15 8l4 4-4 4']);
// The repository: a branch (two commits and a merge), not a brand logo.
export const BranchIcon = createIcon('BranchIcon', [
  [6, 5, 2],
  [6, 19, 2],
  [18, 7, 2],
  'M6 7v10',
  'M18 9a6 6 0 0 1-6 6H8',
]);
// The GitHub mark, outlined on the same grid and stroke as the rest of the set. Path from Lucide (ISC licence).
export const GithubIcon = createIcon('GithubIcon', [
  'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
  'M9 18c-4.51 2-5-2-7-2',
]);
export const CalendarIcon = createIcon('CalendarIcon', [
  'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z',
  'M4 10h16',
  'M8 2v4',
  'M16 2v4',
]);
export const ClockIcon = createIcon('ClockIcon', [[12, 12, 9], 'M12 7v5l3 2']);
export const UserIcon = createIcon('UserIcon', [[12, 8, 4], 'M4 21a8 8 0 0 1 16 0']);
export const MailIcon = createIcon('MailIcon', [
  'M6 5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z',
  'M4 7l8 6 8-6',
]);
// Show / hide a secret (a password).
export const EyeIcon = createIcon('EyeIcon', [
  'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z',
  [12, 12, 3],
]);
export const EyeOffIcon = createIcon('EyeOffIcon', [
  'M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.6 3.5',
  'M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.9 9.9 0 0 0 5.4-1.6',
  'M9.9 9.9a3 3 0 0 0 4.2 4.2',
  'M3 3l18 18',
]);
export const LockIcon = createIcon('LockIcon', [
  'M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z',
  'M8 11V8a4 4 0 0 1 8 0v3',
]);
export const GlobeIcon = createIcon('GlobeIcon', [
  [12, 12, 9],
  'M3 12h18',
  'M12 3a14 14 0 0 1 0 18',
  'M12 3a14 14 0 0 0 0 18',
]);
export const HomeIcon = createIcon('HomeIcon', [
  'M4 11l8-7 8 7',
  'M6 9.5V19a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V9.5',
]);
export const BellIcon = createIcon('BellIcon', ['M6 16V11a6 6 0 0 1 12 0v5l2 2H4z', 'M10 21h4']);
export const PlayIcon = createIcon('PlayIcon', ['M8 5.5v13l10-6.5z']);
export const PauseIcon = createIcon('PauseIcon', ['M9 6v12', 'M15 6v12']);
