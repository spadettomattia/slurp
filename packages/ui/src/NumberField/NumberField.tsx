import { MinusIcon, PlusIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react';

import { Bubble } from '../Bubble/Bubble';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface NumberFieldLabels {
  decrement: string;
  increment: string;
}

export const NUMBERFIELD_LABELS: NumberFieldLabels = {
  decrement: 'Diminuisci',
  increment: 'Aumenta',
};

export interface NumberFieldOwnProps {
  label: ReactNode;
  hint?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Default 0. */
  min?: number;
  /** Default no limit. */
  max?: number;
  /** Default 1; Page Up / Down move ten steps. */
  step?: number;
  disabled?: boolean;
  /** Name for forms (a hidden input carries the value). */
  name?: string;
  labels?: Partial<NumberFieldLabels>;
}

export type NumberFieldProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  NumberFieldOwnProps
>;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * A quantity: the value between − and + (each a 44px target), typed or stepped with the arrow keys. A `spinbutton` with
 * its bounds; the buttons switch off at the ends.
 */
export function NumberField<E extends ElementType = 'div'>(props: NumberFieldProps<E>) {
  const {
    as,
    css,
    className,
    label,
    hint,
    value: valueProp,
    defaultValue,
    onValueChange,
    min = 0,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    disabled = false,
    name,
    labels: labelsProp,
    ...rest
  } = useThemeProps('NumberField', props as NumberFieldProps);
  const labels = { ...NUMBERFIELD_LABELS, ...useLabels('NumberField'), ...labelsProp };
  const [value, setValue] = useControlled({
    value: valueProp,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const [draft, setDraft] = useState<string | null>(null);
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('NumberField', 'root', css);
  const root = useAnimationRoot(rest);
  const set = (v: number) => {
    const next = clamp(Math.round(v / step) * step, min, max);
    if (next !== value) setValue(next);
    setDraft(null);
  };
  const commit = () => {
    if (draft === null) return;
    const parsed = Number(draft.replace(',', '.'));
    if (Number.isFinite(parsed)) set(parsed);
    else setDraft(null);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keys: Record<string, number | undefined> = {
      ArrowUp: value + step,
      ArrowDown: value - step,
      PageUp: value + step * 10,
      PageDown: value - step * 10,
      Home: min,
      End: Number.isFinite(max) ? max : undefined,
    };
    const next = keys[e.key];
    if (next !== undefined) {
      e.preventDefault();
      set(next);
    } else if (e.key === 'Enter') commit();
  };
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-number-field', styled.className, className)}
        data-disabled={disabled || undefined}
        {...root}
      >
        <label className="slurp-field-label" htmlFor={`${id}-input`}>
          {label}
        </label>
        <div className="slurp-number-field-row">
          <Bubble
            appearance="soft"
            tone="neutral"
            label={labels.decrement}
            disabled={disabled || value <= min}
            onClick={() => set(value - step)}
          >
            <MinusIcon />
          </Bubble>
          <input
            id={`${id}-input`}
            className="slurp-number-field-input"
            type="text"
            inputMode={Number.isInteger(step) ? 'numeric' : 'decimal'}
            role="spinbutton"
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={Number.isFinite(max) ? max : undefined}
            aria-describedby={hint != null ? `${id}-hint` : undefined}
            autoComplete="off"
            disabled={disabled}
            value={draft ?? String(value)}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
          />
          <Bubble
            appearance="soft"
            tone="accent"
            label={labels.increment}
            disabled={disabled || value >= max}
            onClick={() => set(value + step)}
          >
            <PlusIcon />
          </Bubble>
        </div>
        {hint != null && (
          <p className="slurp-field-hint" id={`${id}-hint`}>
            {hint}
          </p>
        )}
        {name != null && <input type="hidden" name={name} value={value} />}
      </Root>
    </>
  );
}
