import { CloseIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

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

/** Where a modal panel comes from: centred dialog, or a sheet from the bottom. */
type Variant = 'dialog' | 'sheet';

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Shared by Dialog and Sheet: a native modal <dialog> (top layer, focus contained, Escape, inert page). */
export function useModal(props: DialogProps, variant: Variant) {
  const {
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
  const labels = { ...DIALOG_LABELS, ...labelsProp };
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

  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (typeof el.showModal === 'function') el.showModal();
      else el.setAttribute('open', '');
      grow(el, opener.current, variant);
    } else if (!open && el.open) {
      if (typeof el.close === 'function') el.close();
      else el.removeAttribute('open');
      opener.current?.focus();
      opener.current = null;
    }
  }, [open, variant]);

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

/**
 * The dialog grows out of the control that opened it (the Bloom rule applied to a modal): it starts at the opener's
 * box and settles in the centre. A sheet rises from the bottom edge.
 */
function grow(el: HTMLElement, from: HTMLElement | null, variant: Variant) {
  if (reduced() || typeof el.animate !== 'function') return;
  const timing = { duration: 450, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' };
  if (variant === 'sheet') {
    el.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], timing);
    return;
  }
  const to = el.getBoundingClientRect();
  const at = from?.getBoundingClientRect();
  if (!at || !to.width || !to.height) {
    el.animate(
      [
        { opacity: 0, transform: 'scale(0.96)' },
        { opacity: 1, transform: 'none' },
      ],
      timing,
    );
    return;
  }
  const dx = at.left + at.width / 2 - (to.left + to.width / 2);
  const dy = at.top + at.height / 2 - (to.top + to.height / 2);
  el.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${at.width / to.width}, ${at.height / to.height})`,
        opacity: 0.4,
      },
      { transform: 'none', opacity: 1 },
    ],
    timing,
  );
}

/** Modal dialog, centred, opened from a trigger: title, description, content and one primary action. */
export function Dialog<E extends ElementType = 'dialog'>(props: DialogProps<E>) {
  return useModal(useThemeProps('Dialog', props as DialogProps), 'dialog');
}
