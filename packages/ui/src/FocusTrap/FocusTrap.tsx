import { cx } from '@slurp-ui/utils';
import { useEffect, useRef, type ElementType, type KeyboardEvent, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { FOCUSABLE, focusFirst } from '../utils/focus';
import { useForkRef } from '../utils/useForkRef';

export interface FocusTrapOwnProps {
  /** Traps focus while true. Default true. */
  active?: boolean;
  /** When it stops (or unmounts), focus goes back to what had it before. Default true. */
  restoreFocus?: boolean;
  /** Runs on Escape inside it (to close what it holds). */
  onEscape?: () => void;
  children?: ReactNode;
}

export type FocusTrapProps<E extends ElementType = 'div'> = PolymorphicProps<E, FocusTrapOwnProps>;

/**
 * Keeps Tab inside: from the last control it goes to the first and back. On activation focus moves in (an element
 * marked `data-autofocus` first, else the active choice, else the first control) and on release it goes back to where
 * it was. For custom panels that are not a native `<dialog>`, which already contains focus.
 */
export function FocusTrap<E extends ElementType = 'div'>(props: FocusTrapProps<E>) {
  const {
    as,
    css,
    className,
    active = true,
    restoreFocus = true,
    onEscape,
    children,
    ref,
    onKeyDown,
    ...rest
  } = useThemeProps(
    'FocusTrap',
    props as FocusTrapProps & { onKeyDown?: (e: KeyboardEvent) => void },
  );
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('FocusTrap', 'root', css);
  const own = useRef<HTMLElement>(null);
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, own as never) });

  useEffect(() => {
    if (!active) return;
    const before = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    focusFirst(own.current);
    return () => {
      if (restoreFocus) before?.focus({ preventScroll: true });
    };
  }, [active, restoreFocus]);

  const keys = (e: KeyboardEvent) => {
    onKeyDown?.(e);
    if (!active || e.defaultPrevented) return;
    if (e.key === 'Escape' && onEscape) {
      e.stopPropagation();
      onEscape();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...(own.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
      (el) => {
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      },
    );
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) {
      e.preventDefault();
      return;
    }
    const here = document.activeElement;
    if (e.shiftKey && (here === first || !own.current?.contains(here))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (here === last || !own.current?.contains(here))) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-focus-trap', styled.className, className)}
        onKeyDown={keys}
        {...root}
      >
        {children}
      </Root>
    </>
  );
}
