import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface PinFieldOwnProps {
  label: ReactNode;
  hint?: ReactNode;
  /** Number of characters. Default 6. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once all characters are in. */
  onComplete?: (value: string) => void;
  /** Default `numeric`: digits only. `alphanumeric` takes letters too. */
  kind?: 'numeric' | 'alphanumeric';
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export type PinFieldProps<E extends ElementType = 'div'> = PolymorphicProps<E, PinFieldOwnProps>;

/**
 * A one-time code: one box per character, but a single input underneath — one name for assistive tech, paste and the
 * phone's code suggestion (`autocomplete="one-time-code"`) just work.
 */
export function PinField<E extends ElementType = 'div'>(props: PinFieldProps<E>) {
  const {
    as,
    css,
    className,
    label,
    hint,
    length = 6,
    value: valueProp,
    defaultValue = '',
    onValueChange,
    onComplete,
    kind = 'numeric',
    name,
    disabled = false,
    autoFocus,
    ...rest
  } = useThemeProps('PinField', props as PinFieldProps);
  const [value, setValue] = useControlled({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('PinField', 'root', css);
  const root = useAnimationRoot(rest);
  const allowed = kind === 'numeric' ? /\D/g : /[^\da-z]/gi;
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-pin-field', styled.className, className)}
        style={{ '--slurp-pin-length': length } as Record<string, number>}
        {...root}
      >
        <label className="slurp-field-label" htmlFor={`${id}-input`}>
          {label}
        </label>
        <div className="slurp-pin-field-boxes">
          {Array.from({ length }, (_, i) => (
            <span
              key={i}
              className="slurp-pin-field-box"
              aria-hidden="true"
              data-filled={i < value.length || undefined}
              data-active={i === Math.min(value.length, length - 1) || undefined}
            >
              {value[i] ?? ''}
            </span>
          ))}
          <input
            id={`${id}-input`}
            className="slurp-pin-field-input"
            name={name}
            value={value}
            disabled={disabled}
            autoFocus={autoFocus}
            inputMode={kind === 'numeric' ? 'numeric' : 'text'}
            autoComplete="one-time-code"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={length}
            aria-describedby={hint != null ? `${id}-hint` : undefined}
            onChange={(e) => {
              const next = e.target.value.replace(allowed, '').slice(0, length).toUpperCase();
              setValue(next);
              if (next.length === length && value.length !== length) onComplete?.(next);
            }}
          />
        </div>
        {hint != null && (
          <p className="slurp-field-hint" id={`${id}-hint`}>
            {hint}
          </p>
        )}
      </Root>
    </>
  );
}
