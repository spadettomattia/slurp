import { cx } from '@slurp-ui/utils';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

import { useCss, useThemeProps } from '../internal/styled';
import type { SlurpCss } from '../lib/css';
import { useForkRef } from '../utils/useForkRef';

export interface HintProps {
  /** The text: short, never essential (the trigger must make sense without it). */
  content: ReactNode;
  /** One element that takes focus (a button, a link). */
  children: ReactElement;
  /** Preferred side; it flips when there is no room. Default `top`. */
  placement?: 'top' | 'bottom';
  /** Hover delay in ms before it shows (focus shows it at once). Default 400. */
  delay?: number;
  className?: string;
  css?: SlurpCss;
}

type TriggerProps = {
  ref?: Ref<HTMLElement>;
  'aria-describedby'?: string;
  onPointerEnter?: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLElement>) => void;
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
};

const GAP = 8;
const EDGE = 8;

/**
 * Tooltip: shows on hover (after `delay`) and on focus, hides on Escape, blur or leave; it stays while the pointer is
 * over it (WCAG 1.4.13). Linked to the trigger with aria-describedby. Rendered in the top layer (popover).
 */
export function Hint(props: HintProps) {
  const {
    content,
    children,
    placement = 'top',
    delay = 400,
    className,
    css,
  } = useThemeProps('Hint', props);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState(placement);
  const trigger = useRef<HTMLElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const styled = useCss('Hint', 'root', css);

  const child = Children.only(children);
  const childProps = (isValidElement(child) ? child.props : {}) as TriggerProps;
  const ref = useForkRef(childProps.ref, trigger);

  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };
  const show = (now: boolean) => later(() => setOpen(true), now ? 0 : delay);
  const hide = () => later(() => setOpen(false), 100);

  useEffect(() => () => clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    const el = tip.current;
    const anchor = trigger.current;
    if (!open || !el || !anchor) return;
    el.showPopover?.();
    const place = () => {
      const a = anchor.getBoundingClientRect();
      const t = el.getBoundingClientRect();
      const above = a.top - GAP - t.height;
      const below = a.bottom + GAP;
      const fitsAbove = above >= EDGE;
      const fitsBelow = below + t.height <= innerHeight - EDGE;
      const top =
        placement === 'top'
          ? fitsAbove || !fitsBelow
            ? 'top'
            : 'bottom'
          : fitsBelow || !fitsAbove
            ? 'bottom'
            : 'top';
      const left = Math.min(
        Math.max(EDGE, a.left + a.width / 2 - t.width / 2),
        innerWidth - EDGE - t.width,
      );
      el.style.left = `${left}px`;
      el.style.top = `${top === 'top' ? above : below}px`;
      setSide(top);
    };
    place();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    addEventListener('scroll', place, true);
    addEventListener('resize', place);
    return () => {
      document.removeEventListener('keydown', onKey);
      removeEventListener('scroll', place, true);
      removeEventListener('resize', place);
      el.hidePopover?.();
    };
  }, [open, placement]);

  const triggerElement = isValidElement(child)
    ? // eslint-disable-next-line react-hooks/refs -- the timer ref is read by event handlers, not during render
      cloneElement(child as ReactElement<TriggerProps>, {
        ref,
        'aria-describedby': cx(childProps['aria-describedby'], id),
        onPointerEnter: (e) => {
          childProps.onPointerEnter?.(e);
          if (e.pointerType !== 'touch') show(false);
        },
        onPointerLeave: (e) => {
          childProps.onPointerLeave?.(e);
          hide();
        },
        onFocus: (e) => {
          childProps.onFocus?.(e);
          show(true);
        },
        onBlur: (e) => {
          childProps.onBlur?.(e);
          later(() => setOpen(false), 0);
        },
      })
    : child;

  return (
    <>
      {styled.style}
      {triggerElement}
      <span
        ref={tip}
        id={id}
        role="tooltip"
        popover="manual"
        className={cx('slurp-hint', styled.className, className)}
        data-open={open || undefined}
        data-side={side}
        onPointerEnter={() => clearTimeout(timer.current)}
        onPointerLeave={hide}
      >
        {content}
      </span>
    </>
  );
}
