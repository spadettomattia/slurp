import { CloseIcon } from '@slurp-ui/icons';
import { duration, ease } from '@slurp-ui/tokens';
import { cx } from '@slurp-ui/utils';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ElementType,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

import { useLabels } from '../internal/labels';
import { Bubble } from '../Bubble/Bubble';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';
import { useForkRef } from '../utils/useForkRef';

export interface DialogLabels {
  /** Name of the close button. */
  close: string;
}

export const DIALOG_LABELS: DialogLabels = { close: 'Chiudi' };

export interface DialogOwnProps extends PartsProps<
  'header' | 'title' | 'description' | 'body' | 'footer' | 'close'
> {
  /** The dialog's name (its heading). */
  title: ReactNode;
  description?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Buttons at the bottom (one primary action). */
  actions?: ReactNode;
  /** A press on the backdrop closes it. Default true. */
  dismissible?: boolean;
  labels?: Partial<DialogLabels>;
  children?: ReactNode;
}

export type DialogProps<E extends ElementType = 'dialog'> = PolymorphicProps<E, DialogOwnProps>;

/** Where a modal panel comes from: centred dialog, or a sheet from an edge. */
type Variant = 'dialog' | 'sheet';

/** The edge a sheet is attached to: `bottom` (default), or the `start` / `end` side (flipped in RTL). */
export type SheetSide = 'bottom' | 'start' | 'end';

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Shared by Dialog and Sheet: a native modal <dialog> (top layer, focus contained, Escape, inert page). */
export function useModal(props: DialogProps & { side?: SheetSide }, variant: Variant) {
  const {
    side = 'bottom',
    as,
    css,
    className,
    title,
    description,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    actions,
    dismissible = true,
    labels: labelsProp,
    children,
    parts,
    partProps,
    classNames,
    ref,
    ...rest
  } = props;
  const labels = { ...DIALOG_LABELS, ...useLabels('Dialog'), ...labelsProp };
  const [open, setOpen] = useControlled({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const id = useId();
  const name = variant === 'sheet' ? 'Sheet' : 'Dialog';
  const styled = useCss(name, 'root', css);
  const { part, style } = useParts(name, { parts, partProps, classNames });
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, dialog) });

  const leaving = useRef<Animation | null>(null);
  /** Where a drag left the sheet (px down), so its way out starts from there instead of from rest. */
  const draggedTo = useRef<number | null>(null);
  const grab = useRef<{ y: number; t: number; dy: number } | null>(null);
  const DISMISS_PX = 100;
  const FLICK = 0.11;
  const onGrabDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    grab.current = { y: e.clientY, t: e.timeStamp, dy: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onGrabMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    const el = dialog.current;
    if (!g || !el) return;
    // Down follows the finger 1:1; up resists (a rubber band).
    g.dy = e.clientY - g.y;
    const shown = g.dy >= 0 ? g.dy : g.dy / 6;
    el.style.transform = `translateY(${shown}px)`;
  };
  const onGrabUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    const el = dialog.current;
    grab.current = null;
    if (!g || !el) return;
    const velocity = g.dy / Math.max(1, e.timeStamp - g.t);
    const away = e.type === 'pointerup' && (g.dy > DISMISS_PX || (velocity > FLICK && g.dy > 10));
    if (away) {
      draggedTo.current = g.dy;
      el.style.removeProperty('transform');
      setOpen(false);
      return;
    }
    // Back to rest with the way in's curve.
    el.style.removeProperty('transform');
    if (typeof el.animate === 'function' && g.dy > 0) {
      el.animate([{ transform: `translateY(${g.dy}px)` }, { transform: 'none' }], {
        duration: ms(duration.move),
        easing: EASE,
      });
    }
  };

  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && leaving.current) {
      // Reopened while it was leaving: stop the exit, it is still open.
      leaving.current.cancel();
      leaving.current = null;
      return;
    }
    if (open && !el.open) {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (typeof el.showModal === 'function') el.showModal();
      else el.setAttribute('open', '');
      grow(el, opener.current, variant, side);
    } else if (!open && el.open && !leaving.current) {
      const close = () => {
        leaving.current = null;
        if (typeof el.close === 'function') el.close();
        else el.removeAttribute('open');
        opener.current?.focus();
        opener.current = null;
      };
      const dragged = draggedTo.current;
      draggedTo.current = null;
      const exit = shrink(el, opener.current, variant, side, dragged);
      if (!exit) return close();
      leaving.current = exit;
      exit.finished.then(
        () => {
          if (leaving.current === exit) {
            close();
            exit.cancel();
          }
        },
        () => {
          /* cancelled: reopened */
        },
      );
    }
  }, [open, variant, side]);

  // Unmounting while open: give focus back.
  useEffect(() => () => opener.current?.focus(), []);

  const Root = (as ?? 'dialog') as ElementType;
  const element = (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-dialog', styled.className, className)}
        data-variant={variant}
        data-side={variant === 'sheet' ? side : undefined}
        aria-labelledby={`${id}-title`}
        aria-describedby={description != null ? `${id}-description` : undefined}
        onCancel={(e: SyntheticEvent) => {
          // Escape: the state decides (controlled dialogs stay open until the parent closes them).
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e: MouseEvent<HTMLDialogElement>) => {
          if (dismissible && e.target === e.currentTarget) setOpen(false);
        }}
        {...root}
      >
        {variant === 'sheet' && side === 'bottom' && (
          <div
            className="slurp-dialog-grab"
            aria-hidden="true"
            onPointerDown={onGrabDown}
            onPointerMove={onGrabMove}
            onPointerUp={onGrabUp}
            onPointerCancel={onGrabUp}
          />
        )}
        <div className="slurp-dialog-inner">
          {part('header', 'div', {
            className: 'slurp-dialog-header',
            children: (
              <>
                <div className="slurp-dialog-heading">
                  {part('title', 'h2', {
                    id: `${id}-title`,
                    className: 'slurp-dialog-title',
                    children: title,
                  })}
                  {description != null &&
                    part('description', 'p', {
                      id: `${id}-description`,
                      className: 'slurp-dialog-description',
                      children: description,
                    })}
                </div>
                {part('close', Bubble, {
                  className: 'slurp-dialog-close',
                  label: labels.close,
                  size: 'sm',
                  onClick: () => setOpen(false),
                  children: <CloseIcon />,
                })}
              </>
            ),
          })}
          {children != null && part('body', 'div', { className: 'slurp-dialog-body', children })}
          {actions != null &&
            part('footer', 'div', { className: 'slurp-dialog-footer', children: actions })}
        </div>
      </Root>
    </>
  );
  return element;
}

/** Offset and uniform scale that put `el` on its opener's box (uniform, so the text never stretches). */
function fromOpener(el: HTMLElement, from: HTMLElement | null) {
  const to = el.getBoundingClientRect();
  const at = from?.isConnected ? from.getBoundingClientRect() : undefined;
  if (!at || !to.width || !to.height || !at.width) return undefined;
  const dx = at.left + at.width / 2 - (to.left + to.width / 2);
  const dy = at.top + at.height / 2 - (to.top + to.height / 2);
  const s = Math.min(1, Math.max(0.5, Math.min(at.width / to.width, at.height / to.height)));
  return `translate(${dx}px, ${dy}px) scale(${s})`;
}

/** The transform that puts a sheet fully off its edge. */
function offscreen(el: HTMLElement, side: SheetSide) {
  if (side === 'bottom') return 'translateY(100%)';
  const rtl = getComputedStyle(el).direction === 'rtl';
  return `translateX(${(side === 'end') !== rtl ? '' : '-'}100%)`;
}

const EASE = ease.settle;
/** Milliseconds of a duration token (`'450ms'` → 450). */
const ms = (t: string) => Number.parseFloat(t);

/**
 * The dialog grows out of the control that opened it (the Bloom rule applied to a modal): it starts at the opener's
 * place and settles in the centre. A sheet rises from the bottom edge. Reduced motion: a 150ms fade, as the engine.
 */
function grow(el: HTMLElement, from: HTMLElement | null, variant: Variant, side: SheetSide) {
  if (typeof el.animate !== 'function') return;
  if (reduced()) {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
    return;
  }
  const timing = { duration: ms(duration.panel), easing: EASE };
  if (variant === 'sheet') {
    el.animate([{ transform: offscreen(el, side) }, { transform: 'none' }], timing);
    return;
  }
  const start = fromOpener(el, from) ?? 'scale(0.96)';
  el.animate(
    [
      { transform: start, opacity: 0 },
      { transform: 'none', opacity: 1 },
    ],
    timing,
  );
}

/**
 * The way out, quicker than the way in (200ms): back toward the opener, a sheet back down. Returns the animation to
 * wait for before closing, or nothing when there is nothing to play.
 */
function shrink(
  el: HTMLElement,
  to: HTMLElement | null,
  variant: Variant,
  side: SheetSide,
  fromPx: number | null = null,
): Animation | undefined {
  if (typeof el.animate !== 'function') return undefined;
  const fill = 'forwards' as const;
  if (reduced()) return el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill });
  const timing = { duration: ms(duration.quick), easing: EASE, fill };
  if (variant === 'sheet') {
    const start = fromPx != null && side === 'bottom' ? `translateY(${fromPx}px)` : 'none';
    return el.animate([{ transform: start }, { transform: offscreen(el, side) }], timing);
  }
  const end = fromOpener(el, to) ?? 'scale(0.96)';
  return el.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: end, opacity: 0 },
    ],
    timing,
  );
}

/** Modal dialog, centred, opened from a trigger: title, description, content and one primary action. */
export function Dialog<E extends ElementType = 'dialog'>(props: DialogProps<E>) {
  return useModal(useThemeProps('Dialog', props as DialogProps), 'dialog');
}
