import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { Button } from '../Button/Button';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface ConsentLabels {
  /** Names the banner's region. */
  region: string;
  accept: string;
  reject: string;
  customize: string;
}

export const CONSENT_LABELS: ConsentLabels = {
  region: 'Preferenze sui cookie',
  accept: 'Accetta',
  reject: 'Rifiuta',
  customize: 'Personalizza',
};

export interface ConsentOwnProps {
  /** Shown or not: the app keeps the choice (and decides when to ask again). Default true. */
  open?: boolean;
  title?: ReactNode;
  onAccept?: () => void;
  onReject?: () => void;
  /** Adds a "Personalizza" button, for a settings dialog. */
  onCustomize?: () => void;
  labels?: Partial<ConsentLabels>;
  /** What is asked and why: link the policy here. */
  children?: ReactNode;
}

export type ConsentProps<E extends ElementType = 'section'> = PolymorphicProps<E, ConsentOwnProps>;

/**
 * A consent banner fixed to the bottom of the page. Accepting and rejecting are the same size and weight: refusing
 * is as easy as agreeing. It does not trap focus or block the page; the app stores the answer.
 */
export function Consent<E extends ElementType = 'section'>(props: ConsentProps<E>) {
  const {
    as,
    css,
    className,
    open = true,
    title,
    onAccept,
    onReject,
    onCustomize,
    labels: labelsProp,
    children,
    ...rest
  } = useThemeProps('Consent', props as ConsentProps);
  const labels = { ...CONSENT_LABELS, ...useLabels('Consent'), ...labelsProp };
  const Root = (as ?? 'section') as ElementType;
  const styled = useCss('Consent', 'root', css);
  const root = useAnimationRoot(rest);
  if (!open) return null;
  return (
    <>
      {styled.style}
      <Root
        aria-label={labels.region}
        className={cx('slurp-consent', styled.className, className)}
        {...root}
      >
        <div className="slurp-consent-text">
          {title != null && <p className="slurp-consent-title">{title}</p>}
          {children != null && <div className="slurp-consent-body">{children}</div>}
        </div>
        <div className="slurp-consent-actions">
          <Button tone="neutral" size="sm" onClick={onReject}>
            {labels.reject}
          </Button>
          {onCustomize && (
            <Button tone="neutral" size="sm" onClick={onCustomize}>
              {labels.customize}
            </Button>
          )}
          <Button tone="accent" size="sm" onClick={onAccept}>
            {labels.accept}
          </Button>
        </div>
      </Root>
    </>
  );
}
