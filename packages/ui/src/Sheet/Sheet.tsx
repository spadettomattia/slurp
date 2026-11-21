import type { ElementType } from 'react';

import { useModal, type DialogOwnProps, type DialogProps, type SheetSide } from '../Dialog/Dialog';
import { useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface SheetOwnProps extends DialogOwnProps {
  /** The edge it comes from: `bottom` (default), or `start` / `end` as a side panel (flipped in RTL). */
  side?: SheetSide;
}

export type SheetProps<E extends ElementType = 'dialog'> = PolymorphicProps<E, SheetOwnProps>;

/** Modal panel that rises from the bottom edge (full width on phones), or slides in from a side. Same API as Dialog. */
export function Sheet<E extends ElementType = 'dialog'>(props: SheetProps<E>) {
  return useModal(useThemeProps('Sheet', props as DialogProps), 'sheet');
}
