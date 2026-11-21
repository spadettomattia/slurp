import { cx } from '@slurp-ui/utils';
import {
  useId,
  type ChangeEvent,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface CompareLabels {
  /** Names the slider: how much of the "after" shows. */
  handle: string;
}

export const COMPARE_LABELS: CompareLabels = { handle: 'Confronta prima e dopo' };

export interface CompareOwnProps {
  /** The "before" content (usually an image), on the start side. */
  before: ReactNode;
  /** The "after" content, same size as `before`. */
  after: ReactNode;
  /** Share of the width given to `before`, 0–100. Default 50. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  labels?: Partial<CompareLabels>;
}

export type CompareProps<E extends ElementType = 'div'> = PolymorphicProps<E, CompareOwnProps>;

/** Two pictures in one frame with a divider that sweeps between them: a range input, so keys and touch just work. */
export function Compare<E extends ElementType = 'div'>(props: CompareProps<E>) {
  const {
    as,
    css,
    className,
    before,
    after,
    value: valueProp,
    defaultValue = 50,
    onValueChange,
    labels: labelsProp,
    ...rest
  } = useThemeProps('Compare', props as CompareProps);
  const labels = { ...COMPARE_LABELS, ...useLabels('Compare'), ...labelsProp };
  const [value, setValue] = useControlled({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Compare', 'root', css);
  const root = useAnimationRoot(rest);
  const id = useId();
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-compare', styled.className, className)}
        style={{ '--slurp-compare': `${value}%` } as CSSProperties}
        {...root}
      >
        <div className="slurp-compare-after">{after}</div>
        <div className="slurp-compare-before">{before}</div>
        <span className="slurp-compare-line" aria-hidden="true" />
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={labels.handle}
          aria-valuetext={`${Math.round(value)}%`}
          className="slurp-compare-range"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))}
        />
      </Root>
    </>
  );
}
