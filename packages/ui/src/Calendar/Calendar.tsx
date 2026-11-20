import { ChevronLeftIcon, ChevronRightIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
} from 'react';

import { Bubble } from '../Bubble/Bubble';
import { useTheme } from '../internal/context';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';
import {
  addDays,
  addMonths,
  monthGrid,
  monthOf,
  toDate,
  today as todayIso,
  type IsoDay,
} from './dates';

export interface CalendarLabels {
  previous: string;
  next: string;
}

export const CALENDAR_LABELS: CalendarLabels = {
  previous: 'Mese precedente',
  next: 'Mese successivo',
};

/** A period: `end` is null while only the start has been picked. */
export interface DateRange {
  start: IsoDay;
  end: IsoDay | null;
}

export type CalendarValue = IsoDay | DateRange | null;

export interface CalendarOwnProps {
  /** One day (`'2026-12-08'`), or a period with `range`. */
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (value: CalendarValue) => void;
  /** Pick a period: the first press is the start, the second the end. */
  range?: boolean;
  /** Earliest and latest day that can be picked. */
  min?: IsoDay;
  max?: IsoDay;
  /** Days that cannot be picked (closed days, sold out…). */
  isDateDisabled?: (day: IsoDay) => boolean;
  /** First day of the week: 0 Sunday … 6 Saturday. Default 1 (Monday). */
  weekStartsOn?: number;
  /** The month shown first. Default the value's month, or today's. */
  defaultMonth?: IsoDay;
  /** Move focus to the day (when it opens in a panel). */
  autoFocus?: boolean;
  labels?: Partial<CalendarLabels>;
}

export type CalendarProps<E extends ElementType = 'div'> = PolymorphicProps<E, CalendarOwnProps>;

const startOf = (v: CalendarValue): IsoDay | null =>
  v == null ? null : typeof v === 'string' ? v : v.start;

/**
 * A month to pick a day or a period from. A grid you move through with the arrow keys (Page Up / Down: months,
 * Home / End: the week's ends); day names and the month come from the theme's `locale`.
 */
export function Calendar<E extends ElementType = 'div'>(props: CalendarProps<E>) {
  const {
    as,
    css,
    className,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    range = false,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 1,
    defaultMonth,
    autoFocus = false,
    labels: labelsProp,
    ...rest
  } = useThemeProps('Calendar', props as CalendarProps);
  const labels = { ...CALENDAR_LABELS, ...useLabels('Calendar'), ...labelsProp };
  const { locale } = useTheme();
  const [value, setValue] = useControlled<CalendarValue>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const now = todayIso();
  const [focused, setFocused] = useState<IsoDay>(() => defaultMonth ?? startOf(value) ?? now);
  // A keyboard move asks focus to follow the roving day once it is rendered (also in another month).
  const focusNext = useRef(autoFocus);
  const id = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Calendar', 'root', css);
  const root = useAnimationRoot(rest);

  const month = monthOf(focused);
  const weeks = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const fmt = useMemo(
    () => ({
      month: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      day: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    }),
    [locale],
  );

  const disabled = (day: IsoDay) =>
    (min != null && day < min) || (max != null && day > max) || !!isDateDisabled?.(day);
  const clampDay = (day: IsoDay) => (min && day < min ? min : max && day > max ? max : day);

  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    document.getElementById(`${id}-${focused}`)?.focus();
  }, [focused, id]);

  const move = (day: IsoDay) => {
    focusNext.current = true;
    setFocused(clampDay(day));
  };

  const pick = (day: IsoDay) => {
    if (disabled(day)) return;
    setFocused(day);
    if (!range) return setValue(day);
    const current = value != null && typeof value === 'object' ? value : null;
    if (!current || current.end !== null) return setValue({ start: day, end: null });
    setValue(
      day < current.start ? { start: day, end: current.start } : { start: current.start, end: day },
    );
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const weekday = (toDate(focused).getDay() - weekStartsOn + 7) % 7;
    const keys: Record<string, IsoDay | undefined> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      Home: addDays(focused, -weekday),
      End: addDays(focused, 6 - weekday),
      PageUp: addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: addMonths(focused, e.shiftKey ? 12 : 1),
    };
    const next = keys[e.key];
    if (next) {
      e.preventDefault();
      move(next);
    }
  };

  const selected = (day: IsoDay) =>
    value == null
      ? false
      : typeof value === 'string'
        ? value === day
        : value.start === day || value.end === day;
  const inRange = (day: IsoDay) =>
    value != null &&
    typeof value === 'object' &&
    value.end !== null &&
    day > value.start &&
    day < value.end;

  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-calendar', styled.className, className)}
        data-range={range || undefined}
        {...root}
      >
        <div className="slurp-calendar-head">
          <Bubble
            appearance="plain"
            tone="neutral"
            size="sm"
            label={labels.previous}
            disabled={min != null && monthOf(min) >= month}
            onClick={() => setFocused(clampDay(addMonths(focused, -1)))}
          >
            <ChevronLeftIcon size={18} />
          </Bubble>
          <p className="slurp-calendar-month" id={`${id}-month`} aria-live="polite">
            {fmt.month.format(toDate(month))}
          </p>
          <Bubble
            appearance="plain"
            tone="neutral"
            size="sm"
            label={labels.next}
            disabled={max != null && monthOf(max) <= month}
            onClick={() => setFocused(clampDay(addMonths(focused, 1)))}
          >
            <ChevronRightIcon size={18} />
          </Bubble>
        </div>
        <table className="slurp-calendar-grid" role="grid" aria-labelledby={`${id}-month`}>
          <thead>
            <tr>
              {weeks[0]?.map((day) => (
                <th key={day} scope="col" abbr={fmt.weekdayLong.format(toDate(day))}>
                  {fmt.weekday.format(toDate(day)).slice(0, 2)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody onKeyDown={onKeyDown}>
            {weeks.map((week) => (
              <tr key={week[0]}>
                {week.map((day) => {
                  const off = disabled(day);
                  const on = selected(day);
                  return (
                    <td
                      key={day}
                      role="gridcell"
                      aria-selected={on}
                      data-outside={monthOf(day) !== month || undefined}
                      data-in-range={inRange(day) || undefined}
                      data-edge={(range && on) || undefined}
                    >
                      <button
                        type="button"
                        id={`${id}-${day}`}
                        className="slurp-calendar-day"
                        tabIndex={day === focused ? 0 : -1}
                        aria-label={fmt.day.format(toDate(day))}
                        aria-current={day === now ? 'date' : undefined}
                        aria-disabled={off || undefined}
                        data-selected={on || undefined}
                        data-autofocus={(autoFocus && day === focused) || undefined}
                        onClick={() => pick(day)}
                      >
                        {Number(day.slice(8))}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Root>
    </>
  );
}
