import type { ElementType } from 'react';

import { Field, type FieldOwnProps } from '../Field/Field';
import { useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface TimeFieldOwnProps extends Omit<
  FieldOwnProps,
  | 'type'
  | 'multiline'
  | 'rows'
  | 'inputMode'
  | 'maxLength'
  | 'minLength'
  | 'pattern'
  | 'placeholder'
> {
  /** The time as `HH:MM` (24 hours), or `HH:MM:SS` with a `step` under 60. */
  value?: string;
  defaultValue?: string;
  /** Earliest and latest time (`HH:MM`). */
  min?: string;
  max?: string;
  /** Seconds between the values: 60 (default) shows hours and minutes, 900 jumps by a quarter of an hour. */
  step?: number;
}

export type TimeFieldProps<E extends ElementType = 'div'> = PolymorphicProps<E, TimeFieldOwnProps>;

/**
 * A time of day: the browser's own time input, dressed as a Field. The keyboard, the picker on touch devices and the
 * announcements are the platform's, in the person's language; the value is always `HH:MM`.
 */
export function TimeField<E extends ElementType = 'div'>(props: TimeFieldProps<E>) {
  const rest = useThemeProps('TimeField', props as TimeFieldProps);
  return <Field {...(rest as FieldOwnProps)} type="time" />;
}
