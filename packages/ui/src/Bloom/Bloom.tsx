import { cx } from '@slurp-ui/utils';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { focusFirst } from '../utils/focus';
import { useControlled } from '../utils/useControlled';
import { useDismiss } from '../utils/useDismiss';
import { useForkRef } from '../utils/useForkRef';

export type BloomPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface BloomOwnProps extends PartsProps<'surface' | 'trigger' | 'panel'> {
  /** Content of the trigger button (text, icon, both). */
  trigger: ReactNode;
  /**
   * Name of the trigger when it shows only an icon. An icon trigger stays in its corner when open, 44px and inset by
   * space-2 like the Dock's actions; the panel's first row (its title) sits beside it.
   */
  label?: string;
  /** Trigger content while open (an icon trigger usually becomes a close icon). */
  openTrigger?: ReactNode;
  /** Name of an icon trigger while open ("Chiudi impostazioni"). */
  closeLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Corner the surface grows from: `bottom-start` (default) grows right and down. It flips by itself when the panel
   * would leave the viewport.
   */
  placement?: BloomPlacement;
  /** Open width in px (never wider than the viewport minus 32px). Default 300. */
  width?: number;
  /** Role of the panel: a non-modal `dialog` (default), a `menu` or a `listbox`. */
  role?: 'dialog' | 'menu' | 'listbox';
  /** Name of the panel; default the trigger. */
  panelLabel?: string;
  disabled?: boolean;
  /** The panel. A function gets `close(restoreFocus = true)`. */
  children?: ReactNode | ((close: (restoreFocus?: boolean) => void) => ReactNode);
}

export type BloomProps<E extends ElementType = 'div'> = PolymorphicProps<E, BloomOwnProps>;

/** The Dock's motion: 0.6s, cubic-bezier(0.2, 0.8, 0.2, 1). */
const DURATION = 600;
const VIEWPORT_MARGIN = 16;

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The design system's rule for floating panels: **the button becomes the panel**. One surface grows from the trigger
 * (width, height through grid rows, radius) and shrinks back into it. Closes on a press outside, Escape or Tab out;
 * opening moves focus into the panel; Escape gives it back to the trigger.
 */
export function Bloom<E extends ElementType = 'div'>(props: BloomProps<E>) {
  const {
    as,
    css,
    className,
    trigger: triggerContent,
    label,
    openTrigger,
    closeLabel,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom-start',
    width = 300,
    role = 'dialog',
    panelLabel,
    disabled,
    children,
    style,
    parts,
    partProps,
    classNames,
    ref,
    ...rest
  } = useThemeProps('Bloom', props as BloomProps);
  const [open, setOpen] = useControlled({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [closing, setClosing] = useState(false);
  const [side, setSide] = useState<BloomPlacement>(placement);
  const [box, setBox] = useState<{ w: number; h: number; panel: number } | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(open);
  const boxRef = useRef(box);
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Bloom', 'root', css);
  const { part, style: partsStyle } = useParts('Bloom', { parts, partProps, classNames });
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, rootRef) });

  const popover = useDismiss({
    ref: rootRef,
    open,
    onDismiss: () => setOpen(false),
    fallbackFocus: () => trigger.current,
  });

  // Opening: lock the trigger's box in the layout, pick the side with room, grow from the trigger size.
  useLayoutEffect(() => {
    const s = surface.current;
    const t = trigger.current;
    if (!open || !s || !t) return;
    const r = t.getBoundingClientRect();
    const w = r.width + 2;
    const h = r.height + 2;
    const target = Math.min(width, innerWidth - 2 * VIEWPORT_MARGIN);
    const at = rootRef.current?.getBoundingClientRect() ?? r;
    const panelHeight = panel.current?.scrollHeight ?? 0;
    let [v, x] = placement.split('-') as ['top' | 'bottom', 'start' | 'end'];
    if (x === 'start' && at.left + target > innerWidth - VIEWPORT_MARGIN) x = 'end';
    else if (x === 'end' && at.right - target < VIEWPORT_MARGIN) x = 'start';
    if (
      v === 'bottom' &&
      at.top + h + panelHeight > innerHeight - VIEWPORT_MARGIN &&
      at.top - panelHeight > VIEWPORT_MARGIN
    )
      v = 'top';
    else if (v === 'top' && at.top - panelHeight < VIEWPORT_MARGIN) v = 'bottom';
    setSide(`${v}-${x}`);
    boxRef.current = { w, h, panel: target };
    setBox(boxRef.current);
    // Start exactly from the trigger's box (no transition into the start values), then grow.
    s.style.transition = 'none';
    s.style.width = `${w}px`;
    s.style.borderRadius = `${h / 2}px`;
    void s.offsetWidth;
    s.style.transition = '';
    s.style.width = `${target}px`;
    s.style.borderRadius = '';
  }, [open, placement, width]);

  // Closing: shrink back into the trigger, then return to the flow.
  useLayoutEffect(() => {
    const s = surface.current;
    if (open || !wasOpen.current) {
      wasOpen.current = open;
      return;
    }
    wasOpen.current = open;
    const last = boxRef.current;
    // The trigger's label may have changed while open (a Choice shows the new value): shrink to its size now.
    const t = trigger.current;
    const w = last && !label && t ? t.getBoundingClientRect().width + 2 : last?.w;
    if (s && last && w) {
      boxRef.current = { ...last, w };
      setBox(boxRef.current);
      s.style.width = `${w}px`;
      s.style.borderRadius = `${last.h / 2}px`;
    }
    setClosing(true);
    const timer = setTimeout(
      () => {
        setClosing(false);
        if (s) {
          s.style.width = '';
          s.style.borderRadius = '';
        }
      },
      reduced() ? 0 : DURATION,
    );
    return () => clearTimeout(timer);
  }, [open, label]);

  useEffect(() => {
    if (open) focusFirst(panel.current);
  }, [open]);

  const phase = open ? 'open' : closing ? 'closing' : 'closed';
  const floating = phase !== 'closed' && box;
  const [v, x] = side.split('-');
  const close = (restoreFocus = true) => popover.dismiss(restoreFocus);

  return (
    <>
      {styled.style}
      {partsStyle}
      <Root
        className={cx('slurp-bloom', styled.className, className)}
        data-phase={phase}
        data-icon={label ? '' : undefined}
        data-side={v}
        data-align={x}
        style={
          {
            ...(floating ? { width: box.w, height: box.h } : null),
            ...style,
          } as CSSProperties
        }
        onKeyDown={popover.containerProps.onKeyDown}
        onBlur={popover.containerProps.onBlur}
        {...root}
      >
        {part('surface', 'div', {
          ref: surface,
          className: 'slurp-bloom-surface',
          children: (
            <>
              {part('trigger', 'button', {
                ref: trigger,
                type: 'button',
                id: `${id}-trigger`,
                className: 'slurp-bloom-trigger',
                'aria-label': open && closeLabel ? closeLabel : label,
                'aria-haspopup': role === 'dialog' ? 'dialog' : role,
                'aria-expanded': open,
                'aria-controls': `${id}-panel`,
                disabled,
                onClick: (e: MouseEvent<HTMLButtonElement>) => {
                  if (open) return popover.dismiss(false);
                  popover.opened(e.currentTarget);
                  setOpen(true);
                },
                children: open && openTrigger !== undefined ? openTrigger : triggerContent,
              })}
              <div className="slurp-bloom-clip">
                {part('panel', 'div', {
                  ref: panel,
                  id: `${id}-panel`,
                  role,
                  'aria-label': panelLabel,
                  'aria-labelledby': panelLabel ? undefined : `${id}-trigger`,
                  className: 'slurp-bloom-panel',
                  inert: !open,
                  style: box ? { width: box.panel - 2 } : undefined,
                  children: typeof children === 'function' ? children(close) : children,
                })}
              </div>
            </>
          ),
        })}
      </Root>
    </>
  );
}
