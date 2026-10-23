import { cx } from '@slurp-ui/utils';
import {
  useId,
  type ChangeEvent,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface RangeOwnProps extends PartsProps<'label' | 'value' | 'control'> {
  /** Visible label. */
  label: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /** Default 1. */
  step?: number;
  /** Text of the value, shown next to the label and read by screen readers ("1.200 €"). */
  formatValue?: (value: number) => string;
  /** Shows the value next to the label. Default true. */
  showValue?: boolean;
  name?: string;
  disabled?: boolean;
}

export type RangeProps<E extends ElementType = 'div'> = PolymorphicProps<E, RangeOwnProps>;

/** Slider on a native range input: 44px thumb target, accent-ink fill, arrow keys / Page keys / Home / End. */
export function Range<E extends ElementType = 'div'>(props: RangeProps<E>) {
  const {
    as,
    css,
    className,
    label,
    value: valueProp,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    formatValue = String,
    showValue = true,
    name,
    disabled,
    style,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Range', props as RangeProps);
  const [value, setValue] = useControlled({
    value: valueProp,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Range', 'root', css);
  const { part, style: partsStyle } = useParts('Range', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const ratio = max > min ? (Math.min(max, Math.max(min, value)) - min) / (max - min) : 0;
  const text = formatValue(value);
  return (
    <>
      {styled.style}
      {partsStyle}
      <Root
        className={cx('slurp-range', styled.className, className)}
        data-disabled={disabled ? '' : undefined}
        style={{ '--slurp-range-ratio': ratio, ...style } as CSSProperties}
        {...root}
      >
        <div className="slurp-range-head">
          {part('label', 'label', { htmlFor: id, className: 'slurp-range-label', children: label })}
          {showValue &&
            part('value', 'output', {
              htmlFor: id,
              className: 'slurp-range-value',
              children: text,
            })}
        </div>
        {part('control', 'input', {
          id,
          type: 'range',
          className: 'slurp-range-control',
          name,
          min,
          max,
          step,
          disabled,
          value,
          'aria-valuetext': text,
          onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value)),
        })}
      </Root>
    </>
  );
}
