import { CheckIcon, ChevronDownIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, useRef, type ElementType, type KeyboardEvent, type ReactNode } from 'react';

import { Bloom, type BloomPlacement } from '../Bloom/Bloom';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { moveFocus } from '../utils/focus';
import { useControlled } from '../utils/useControlled';

export interface ChoiceOption<V extends string = string> {
  value: V;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ChoiceLabels {
  /** Trigger text while nothing is chosen. */
  placeholder: string;
}

export const CHOICE_LABELS: ChoiceLabels = { placeholder: 'Scegli…' };

export interface ChoiceOwnProps<V extends string = string> {
  /** Visible label ("Ordina per"). */
  label: ReactNode;
  options: ChoiceOption<V>[];
  value?: V | null;
  defaultValue?: V | null;
  onValueChange?: (value: V) => void;
  /** Form field name: a hidden input carries the value. */
  name?: string;
  disabled?: boolean;
  /** Panel width. Default 280. */
  width?: number;
  placement?: BloomPlacement;
  labels?: Partial<ChoiceLabels>;
}

export type ChoiceProps<
  V extends string = string,
  E extends ElementType = 'div',
> = PolymorphicProps<E, ChoiceOwnProps<V>>;

/**
 * Select: the trigger **becomes** the list (Bloom). ArrowDown / ArrowUp / Enter / Space open it on the trigger;
 * in the list arrows move, Enter or Space choose, Escape closes and gives focus back.
 */
export function Choice<V extends string = string, E extends ElementType = 'div'>(
  props: ChoiceProps<V, E>,
) {
  const {
    as,
    css,
    className,
    label,
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    name,
    disabled,
    width = 280,
    placement,
    labels: labelsProp,
    ...rest
  } = useThemeProps('Choice', props as unknown as ChoiceProps);
  const labels = { ...CHOICE_LABELS, ...labelsProp };
  const [value, setValue] = useControlled<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: string | null) => void) | undefined,
  });
  const [open, setOpen] = useControlled({ value: undefined, defaultValue: false });
  const list = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Choice', 'root', css);
  const root = useAnimationRoot(rest);
  const chosen = options.find((o) => o.value === value);

  const choose = (o: ChoiceOption, close: (restore?: boolean) => void) => {
    if (o.disabled) return;
    setValue(o.value);
    close(true);
  };

  return (
    <>
      {styled.style}
      <Root className={cx('slurp-choice', styled.className, className)} {...root}>
        <span id={labelId} className="slurp-choice-label">
          {label}
        </span>
        <Bloom
          open={open}
          onOpenChange={setOpen}
          role="listbox"
          width={width}
          placement={placement}
          disabled={disabled}
          trigger={
            <>
              <span className={cx('slurp-choice-value', !chosen && 'slurp-choice-placeholder')}>
                {chosen?.label ?? labels.placeholder}
              </span>
              <ChevronDownIcon size={18} />
            </>
          }
          partProps={{
            trigger: {
              'aria-labelledby': `${labelId} ${labelId}-value`,
              onKeyDown: (e: KeyboardEvent) => {
                if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                  e.preventDefault();
                  setOpen(true);
                }
              },
            },
            panel: { 'aria-labelledby': labelId },
          }}
        >
          {(close) => (
            <div
              ref={list}
              className="slurp-choice-list"
              onKeyDown={(e) => {
                if (moveFocus(e, list.current, '[role="option"]')) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  const at = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
                  const o = options.find((x) => x.value === at?.dataset.value);
                  if (o) {
                    e.preventDefault();
                    choose(o, close);
                  }
                }
              }}
            >
              {options.map((o) => {
                const on = o.value === value;
                return (
                  <div
                    key={o.value}
                    role="option"
                    tabIndex={-1}
                    aria-selected={on}
                    aria-disabled={o.disabled || undefined}
                    data-value={o.value}
                    className="slurp-bloom-item"
                    onClick={() => choose(o, close)}
                  >
                    {o.icon != null && (
                      <span className="slurp-bloom-item-icon" aria-hidden="true">
                        {o.icon}
                      </span>
                    )}
                    <span className="slurp-bloom-item-label">{o.label}</span>
                    {on && (
                      <span className="slurp-bloom-item-check" aria-hidden="true">
                        <CheckIcon size={18} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Bloom>
        <span id={`${labelId}-value`} hidden>
          {chosen?.label ?? labels.placeholder}
        </span>
        {name && <input type="hidden" name={name} value={value ?? ''} />}
      </Root>
    </>
  );
}
