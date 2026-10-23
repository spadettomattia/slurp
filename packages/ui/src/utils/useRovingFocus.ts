import { useCallback, type KeyboardEvent, type RefObject } from 'react';

import { moveFocus, type MoveFocusOptions } from './focus';

export interface RovingFocusOptions extends Pick<MoveFocusOptions, 'orientation' | 'loop'> {
  /** The items, inside the container. */
  selector: string;
  /** Selection follows focus (tabs, segmented controls): the item reached is also clicked. */
  select?: boolean;
}

/**
 * One tab stop for a group (tabIndex 0 on the active item, -1 on the others) and arrow keys between the items.
 * Spread the returned onKeyDown on the container.
 */
export function useRovingFocus(
  ref: RefObject<HTMLElement | null>,
  { selector, orientation = 'horizontal', loop = true, select = false }: RovingFocusOptions,
) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const next = moveFocus(e, ref.current, selector, { orientation, loop });
      if (next && select) next.click();
    },
    [ref, selector, orientation, loop, select],
  );
  return { onKeyDown };
}
