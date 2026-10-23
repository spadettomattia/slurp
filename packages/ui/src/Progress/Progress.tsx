import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface ProgressOwnProps {
  /** What is in progress ("Caricamento"): the accessible name. */
  label: string;
  /** Between 0 and `max`; leave it out while the amount is unknown (indeterminate). */
  value?: number;
  /** Default 100. */
  max?: number;
  /** `bar` (default) or `ring`. */
  shape?: 'bar' | 'ring';
  /** Ring diameter in px. Default 48. */
  size?: number;
  /** Shows the value: the percentage, or what `formatValue` returns. */
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
}

export type ProgressProps<E extends ElementType = 'div'> = PolymorphicProps<E, ProgressOwnProps>;

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

/** Progress as a bar or a ring (the design system's ScoreRing geometry). The filled part is accent-ink (≥ 3:1). */
export function Progress<E extends ElementType = 'div'>(props: ProgressProps<E>) {
  const {
    as,
    css,
    className,
    label,
    value,
    max = 100,
    shape = 'bar',
    size = 48,
    showValue = false,
    formatValue = (v: number, m: number) => `${Math.round((v / m) * 100)}%`,
    style,
    ...rest
  } = useThemeProps('Progress', props as ProgressProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Progress', 'root', css);
  const root = useAnimationRoot(rest);
  const known = typeof value === 'number' && Number.isFinite(value);
  const clamped = known ? Math.min(max, Math.max(0, value)) : 0;
  const ratio = max > 0 ? clamped / max : 0;
  const text = known ? formatValue(clamped, max) : undefined;
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-progress', styled.className, className)}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={known ? clamped : undefined}
        aria-valuetext={text}
        data-shape={shape}
        data-indeterminate={known ? undefined : ''}
        style={{ '--slurp-progress-ratio': ratio, ...style } as CSSProperties}
        {...root}
      >
        {shape === 'ring' ? (
          <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
            <circle className="slurp-progress-track" cx="40" cy="40" r={RING_R} />
            <circle
              className="slurp-progress-fill"
              cx="40"
              cy="40"
              r={RING_R}
              strokeDasharray={`${(known ? ratio : 0.25) * RING_C} ${RING_C}`}
              transform="rotate(-90 40 40)"
            />
          </svg>
        ) : (
          <span className="slurp-progress-bar" aria-hidden="true">
            <span className="slurp-progress-fill" />
          </span>
        )}
        {showValue && text && (
          <span className="slurp-progress-value" aria-hidden="true">
            {text}
          </span>
        )}
      </Root>
    </>
  );
}
