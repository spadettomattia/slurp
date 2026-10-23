import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface ScoreOwnProps {
  score: number;
  /** Default 10. */
  max?: number;
  /** Diameter in px. Default 96. */
  size?: number;
  /** What is scored, for the accessible name: "Punteggio 9.1 su 10". Default `Punteggio`. */
  label?: string;
}

export type ScoreProps<E extends ElementType = 'span'> = PolymorphicProps<E, ScoreOwnProps>;

const R = 34;
const C = 2 * Math.PI * R;

/** A score with one decimal in a ring (accent-ink arc, ≥ 3:1). */
export function Score<E extends ElementType = 'span'>(props: ScoreProps<E>) {
  const {
    as,
    css,
    className,
    score,
    max = 10,
    size = 96,
    label = 'Punteggio',
    ...rest
  } = useThemeProps('Score', props as ScoreProps);
  const Root = (as ?? 'span') as ElementType;
  const styled = useCss('Score', 'root', css);
  const root = useAnimationRoot(rest);
  const value = Number(score) || 0;
  const shown = value.toFixed(1);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-score', styled.className, className)}
        role="img"
        aria-label={`${label} ${shown} su ${max}`}
        {...root}
      >
        <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
          <circle className="slurp-score-track" cx="40" cy="40" r={R} />
          <circle
            className="slurp-score-arc"
            cx="40"
            cy="40"
            r={R}
            strokeDasharray={`${(Math.min(max, Math.max(0, value)) / max) * C} ${C}`}
            transform="rotate(-90 40 40)"
          />
          <text x="40" y="47" textAnchor="middle" className="slurp-score-label">
            {shown}
          </text>
        </svg>
      </Root>
    </>
  );
}
