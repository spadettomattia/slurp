import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';

export interface DismissOptions {
  /** The container: a press inside it does not close. */
  ref: RefObject<HTMLElement | null>;
  open: boolean;
  onDismiss: () => void;
  /** Where Escape sends focus when no opener was recorded. */
  fallbackFocus?: () => HTMLElement | null;
}

/**
 * The shared rules of floating panels: a press outside, Escape or Tab out close it; Escape gives focus back to the
 * opener (recorded with `opened(el)`) or to `fallbackFocus()`; a press away or Tab leave focus where the person put it.
 * Spread `containerProps` on the container.
 */
export function useDismiss(options: DismissOptions) {
  const opener = useRef<HTMLElement | null>(null);
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });

  const dismiss = useCallback((restoreFocus: boolean) => {
    const o = latest.current;
    const back = opener.current ?? o.fallbackFocus?.() ?? null;
    opener.current = null;
    // Closed from now on, even before the parent re-renders: moving focus out must not close it twice.
    latest.current = { ...o, open: false };
    o.onDismiss();
    if (restoreFocus) back?.focus();
  }, []);

  useEffect(() => {
    if (!options.open) return;
    const onDown = (e: PointerEvent) => {
      const root = latest.current.ref.current;
      if (root && e.target instanceof Node && root.contains(e.target)) return;
      opener.current = null;
      latest.current.onDismiss();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [options.open]);

  const containerProps = {
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Escape' && latest.current.open) {
        e.preventDefault();
        e.stopPropagation();
        dismiss(true);
      }
    },
    onBlur: (e: FocusEvent) => {
      const root = latest.current.ref.current;
      const to = e.relatedTarget;
      if (latest.current.open && to instanceof Node && root && !root.contains(to)) dismiss(false);
    },
  };

  /** Records the element that opened the panel (focus goes back to it on Escape). */
  const opened = useCallback((el: HTMLElement | null) => {
    opener.current = el;
  }, []);

  return { opened, dismiss, containerProps };
}
