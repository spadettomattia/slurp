// Paths of the design system's icon set (24×24, 2px stroke). One export per icon: unused ones are tree-shaken.
import { createIcon } from './createIcon';

export const CheckIcon = createIcon('CheckIcon', ['M5 12.5l4.5 4.5L19 7.5']);
export const CloseIcon = createIcon('CloseIcon', ['M6 6l12 12', 'M18 6L6 18']);
export const MinusIcon = createIcon('MinusIcon', ['M6 12h12']);
export const ChevronDownIcon = createIcon('ChevronDownIcon', ['M6 9l6 6 6-6']);
export const ArrowLeftIcon = createIcon('ArrowLeftIcon', ['M19 12H5', 'M11 18l-6-6 6-6']);
export const ArrowDownIcon = createIcon('ArrowDownIcon', ['M12 5v14', 'M6 13l6 6 6-6']);
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
