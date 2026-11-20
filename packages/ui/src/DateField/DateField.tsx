import { CalendarIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, useMemo, type ElementType, type ReactNode } from 'react';

import { Bloom, type BloomPlacement } from '../Bloom/Bloom';
import { Calendar, type CalendarProps, type CalendarValue } from '../Calendar/Calendar';
import { toDate } from '../Calendar/dates';
import { useTheme } from '../internal/context';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface DateFieldLabels {
  /** Shown while nothing is chosen. */
  placeholder: string;
}

export const DATEFIELD_LABELS: DateFieldLabels = { placeholder: 'Scegli una data' };

export interface DateFieldOwnProps extends Pick<
  CalendarProps,
  'range' | 'min' | 'max' | 'isDateDisabled' | 'weekStartsOn'
> {
  label: ReactNode;
  hint?: ReactNode;
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (value: CalendarValue) => void;
  /** Form names: one hidden input with the day, or two (`<name>-start`, `<name>-end`) for a period. */
  name?: string;
  disabled?: boolean;
  placement?: BloomPlacement;
  labels?: Partial<DateFieldLabels>;
}

export type DateFieldProps<E extends ElementType = 'div'> = PolymorphicProps<E, DateFieldOwnProps>;

/**
 * A date, or a period with `range`: the field shows it in the theme's language and grows into a Calendar (the Bloom
 * rule: the control becomes the panel). It closes once a day, or a period's end, is picked.
 */
export function DateField<E extends ElementType = 'div'>(props: DateFieldProps<E>) {
  const {
    as,
    css,
    className,
    label,
    hint,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    range = false,
    min,
    max,
    isDateDisabled,
    weekStartsOn,
    name,
    disabled,
    placement,
    labels: labelsProp,
    ...rest
  } = useThemeProps('DateField', props as DateFieldProps);
  const labels = { ...DATEFIELD_LABELS, ...useLabels('DateField'), ...labelsProp };
  const { locale } = useTheme();
  const [value, setValue] = useControlled<CalendarValue>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControlled({ value: undefined, defaultValue: false });
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('DateField', 'root', css);
  const root = useAnimationRoot(rest);
  const fmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
    [locale],
  );

  const text =
    value == null
      ? null
      : typeof value === 'string'
        ? fmt.format(toDate(value))
        : value.end
          ? fmt.formatRange(toDate(value.start), toDate(value.end))
          : `${fmt.format(toDate(value.start))} –`;

  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-date-field', styled.className, className)}
        data-disabled={disabled || undefined}
        {...root}
      >
        <span className="slurp-field-label" id={`${id}-label`}>
          {label}
        </span>
        <Bloom
          open={open}
          onOpenChange={setOpen}
          role="dialog"
          width={352}
          placement={placement}
          disabled={disabled}
          trigger={
            <>
              <CalendarIcon size={18} />
              <span
                className={cx('slurp-date-field-value', !text && 'slurp-date-field-placeholder')}
              >
                {text ?? labels.placeholder}
              </span>
            </>
          }
          partProps={{
            trigger: {
              'aria-labelledby': `${id}-label ${id}-value`,
              'aria-describedby': hint != null ? `${id}-hint` : undefined,
            },
            panel: { 'aria-labelledby': `${id}-label` },
          }}
        >
          {(close) => (
            <Calendar
              className="slurp-date-field-calendar"
              value={value}
              range={range}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              autoFocus
              onValueChange={(next) => {
                setValue(next);
                if (next != null && (typeof next === 'string' || next.end !== null)) close(true);
              }}
            />
          )}
        </Bloom>
        <span id={`${id}-value`} hidden>
          {text ?? labels.placeholder}
        </span>
        {hint != null && (
          <p className="slurp-field-hint" id={`${id}-hint`}>
            {hint}
          </p>
        )}
        {name != null &&
          (range ? (
            <>
              <input
                type="hidden"
                name={`${name}-start`}
                value={value != null && typeof value === 'object' ? value.start : ''}
              />
              <input
                type="hidden"
                name={`${name}-end`}
                value={value != null && typeof value === 'object' ? (value.end ?? '') : ''}
              />
            </>
          ) : (
            <input type="hidden" name={name} value={typeof value === 'string' ? value : ''} />
          ))}
      </Root>
    </>
  );
}
