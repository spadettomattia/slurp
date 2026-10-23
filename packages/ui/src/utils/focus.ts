import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

/** Elements that take focus with Tab (enabled controls, links, explicit tab stops). */
export const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

/** The active choice of a panel: a pressed chip, a checked radio, a selected option or tab. */
const ACTIVE_CHOICE =
  '[aria-pressed="true"], [aria-selected="true"], [aria-checked="true"], input[type="radio"]:checked';

/** Focuses the active choice inside root, else its first enabled control (when a panel opens). */
export function focusFirst(root: HTMLElement | null): HTMLElement | null {
  const el =
    root?.querySelector<HTMLElement>(ACTIVE_CHOICE) ?? root?.querySelector<HTMLElement>(FOCUSABLE);
  el?.focus({ preventScroll: true });
  return el ?? null;
}

export interface MoveFocusOptions {
  /** `vertical` (default): ArrowUp / ArrowDown. `horizontal`: ArrowLeft / ArrowRight (flipped in RTL). `both`. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** From the last item to the first and back. Default false. */
  loop?: boolean;
  /** ArrowUp (or ArrowLeft) from the first item, when not looping: e.g. back to the field above the list. */
  onExitStart?: () => void;
}

/**
 * Arrow keys in a list of controls: to the next / previous `selector` inside root; Home / End to the ends once focus is
 * in the list. Disabled items are skipped. Returns the element focused, or null when the key was not handled.
 */
export function moveFocus(
  e: ReactKeyboardEvent | KeyboardEvent,
  root: HTMLElement | null,
  selector: string,
  options: MoveFocusOptions | (() => void) = {},
): HTMLElement | null {
  const {
    orientation = 'vertical',
    loop = false,
    onExitStart,
  } = typeof options === 'function' ? { onExitStart: options } : options;
  const items = root
    ? [...root.querySelectorAll<HTMLElement>(selector)].filter(
        (el) => !el.matches(':disabled, [aria-disabled="true"]'),
      )
    : [];
  if (!items.length) return null;
  const rtl = root ? getComputedStyle(root).direction === 'rtl' : false;
  const vertical = orientation !== 'horizontal';
  const horizontal = orientation !== 'vertical';
  const at = items.indexOf(document.activeElement as HTMLElement);
  let step = 0;
  if (vertical && e.key === 'ArrowDown') step = 1;
  else if (vertical && e.key === 'ArrowUp') step = -1;
  else if (horizontal && e.key === 'ArrowRight') step = rtl ? -1 : 1;
  else if (horizontal && e.key === 'ArrowLeft') step = rtl ? 1 : -1;
  let to: number;
  if (step) to = at + step;
  else if (e.key === 'Home' && at >= 0) to = 0;
  else if (e.key === 'End' && at >= 0) to = items.length - 1;
  else return null;
  e.preventDefault();
  if (to < 0) {
    if (!loop) {
      onExitStart?.();
      return null;
    }
    to = items.length - 1;
  }
  if (to >= items.length) to = loop ? 0 : items.length - 1;
  const next = items[to] ?? null;
  next?.focus();
  return next;
}
