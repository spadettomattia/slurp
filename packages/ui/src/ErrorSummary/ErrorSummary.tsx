import { ErrorIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useEffect, useId, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface ErrorSummaryLabels {
  /** The title, from the number of errors. */
  title: (count: number) => string;
}

export const ERRORSUMMARY_LABELS: ErrorSummaryLabels = {
  title: (n) => (n === 1 ? 'C’è un errore da correggere' : `Ci sono ${n} errori da correggere`),
};

export interface ErrorSummaryItem {
  /** id of the field's input: the link goes there and focuses it. */
  id: string;
  message: ReactNode;
}

export interface ErrorSummaryOwnProps {
  errors: readonly ErrorSummaryItem[];
  /** Move focus to the summary when errors appear (after a submit). Default true. */
  focusOnShow?: boolean;
  labels?: Partial<ErrorSummaryLabels>;
}

export type ErrorSummaryProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  ErrorSummaryOwnProps
>;

/**
 * The errors of a long form, at its top after a submit: a title with the count and one link per error that takes you to
 * the field. It takes focus when it appears, so a screen reader reads it first. Each field still shows its own error.
 */
export function ErrorSummary<E extends ElementType = 'div'>(props: ErrorSummaryProps<E>) {
  const {
    as,
    css,
    className,
    errors,
    focusOnShow = true,
    labels: labelsProp,
    ...rest
  } = useThemeProps('ErrorSummary', props as ErrorSummaryProps);
  const labels = { ...ERRORSUMMARY_LABELS, ...useLabels('ErrorSummary'), ...labelsProp };
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('ErrorSummary', 'root', css);
  const root = useAnimationRoot(rest);
  const key = errors.map((e) => e.id).join(' ');
  useEffect(() => {
    if (focusOnShow && key) document.getElementById(id)?.focus();
  }, [focusOnShow, key, id]);
  if (!errors.length) return null;
  return (
    <>
      {styled.style}
      <Root
        id={id}
        className={cx('slurp-error-summary', styled.className, className)}
        role="alert"
        tabIndex={-1}
        aria-labelledby={`${id}-title`}
        {...root}
      >
        <p className="slurp-error-summary-title" id={`${id}-title`}>
          <ErrorIcon size={20} aria-hidden />
          {labels.title(errors.length)}
        </p>
        <ul className="slurp-error-summary-list">
          {errors.map((e) => (
            <li key={e.id}>
              <a
                className="slurp-error-summary-link"
                href={`#${e.id}`}
                onClick={(event) => {
                  const field = document.getElementById(e.id);
                  if (!field) return;
                  event.preventDefault();
                  field.focus();
                  field.scrollIntoView({ block: 'center' });
                }}
              >
                {e.message}
              </a>
            </li>
          ))}
        </ul>
      </Root>
    </>
  );
}
