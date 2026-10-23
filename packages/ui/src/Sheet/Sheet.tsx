import type { ElementType } from 'react';

import { useModal, type DialogProps } from '../Dialog/Dialog';
import { useThemeProps } from '../internal/styled';

export type SheetProps<E extends ElementType = 'dialog'> = DialogProps<E>;

/** Modal panel that rises from the bottom edge (full width on phones). Same API as Dialog. */
export function Sheet<E extends ElementType = 'dialog'>(props: SheetProps<E>) {
  return useModal(useThemeProps('Sheet', props as DialogProps), 'sheet');
}
