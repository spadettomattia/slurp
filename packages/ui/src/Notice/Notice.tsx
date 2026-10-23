import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { Bubble } from '../Bubble/Bubble';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface NoticeLabels {
  /** The word that names each tone (shown as the title when there is none). */
  neutral: string;
  success: string;
  warning: string;
  danger: string;
  /** Name of the close button. */
  dismiss: string;
}

export const NOTICE_LABELS: NoticeLabels = {
  neutral: 'Nota',
  success: 'Fatto',
  warning: 'Attenzione',
  danger: 'Errore',
  dismiss: 'Chiudi avviso',
};

export interface NoticeOwnProps extends PartsProps<'icon' | 'title' | 'body' | 'dismiss'> {
  /** Default `neutral`. The state is an icon plus a word, never colour alone. */
  tone?: StatusTone;
  /** Short title; default the tone's word (`labels`). */
  title?: ReactNode;
  children?: ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  labels?: Partial<NoticeLabels>;
}

export type NoticeProps<E extends ElementType = 'div'> = PolymorphicProps<E, NoticeOwnProps>;

const ICONS = { neutral: InfoIcon, success: SuccessIcon, warning: WarningIcon, danger: ErrorIcon };

/**
 * A message in the page (alert): icon + word + text. `role="status"` by default (announced politely when it appears);
 * pass `role="alert"` for errors that must interrupt.
 */
export function Notice<E extends ElementType = 'div'>(props: NoticeProps<E>) {
  const {
    as,
    css,
    className,
    tone = 'neutral',
    title,
    children,
    onDismiss,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Notice', props as NoticeProps);
  const labels = { ...NOTICE_LABELS, ...labelsProp };
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Notice', 'root', css);
  const { part, style } = useParts('Notice', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const titleId = useId();
  const Icon = ICONS[tone];
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-notice', styled.className, className)}
        role="status"
        aria-labelledby={titleId}
        data-tone={tone}
        {...root}
      >
        {part('icon', 'span', {
          className: 'slurp-notice-icon',
          'aria-hidden': true,
          children: <Icon size={22} />,
        })}
        <div className="slurp-notice-text">
          {part('title', 'p', {
            id: titleId,
            className: 'slurp-notice-title',
            children: title ?? labels[tone],
          })}
          {children != null && part('body', 'div', { className: 'slurp-notice-body', children })}
        </div>
        {onDismiss &&
          part('dismiss', Bubble, {
            className: 'slurp-notice-dismiss',
            label: labels.dismiss,
            size: 'sm',
            onClick: onDismiss,
            children: <CloseIcon />,
          })}
      </Root>
    </>
  );
}
