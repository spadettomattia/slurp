import { StarIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, type CSSProperties, type ElementType } from 'react';

import type { ControlSize } from '../Button/Button';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface RatingLabels {
  /** The value as words ("4.5 su 5"): the name of a read-only rating, after its label. */
  value: (value: string, max: number) => string;
  /** Name of one star of the input ("3 stelle"). */
  star: (stars: number) => string;
}

export const RATING_LABELS: RatingLabels = {
  value: (v, max) => `${v} su ${max}`,
  star: (n) => (n === 1 ? '1 stella' : `${n} stelle`),
};

export interface RatingOwnProps {
  /** What is rated ("Il tuo voto", "Valutazione media"): the legend of the input, the name of a read-only rating. */
  label: string;
  /** Stars chosen; null for none yet. A read-only rating may be fractional (4.5). */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number) => void;
  /** Number of stars. Default 5. */
  max?: number;
  /** Shows a value instead of asking for one: one image named "Valutazione media: 4.5 su 5". */
  readOnly?: boolean;
  /** Form field name (radio inputs). */
  name?: string;
  disabled?: boolean;
  /** Star size: `sm` 20, `md` 28 (default), `lg` 36. Each star of the input stays a 44px target. */
  size?: ControlSize;
  labels?: Partial<RatingLabels>;
}

export type RatingProps<E extends ElementType = 'fieldset'> = PolymorphicProps<E, RatingOwnProps>;

const ICON: Record<ControlSize, number> = { sm: 20, md: 28, lg: 36 };

/** One decimal, like scores; whole numbers stay whole ("4", "4.5"). */
const shown = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/**
 * Stars. As an input it is a group of native radios (arrow keys move and choose, the legend names it): chosen stars
 * are filled, the others outlined (shape, not only colour). Read-only it is one image with the value in words.
 */
export function Rating<E extends ElementType = 'fieldset'>(props: RatingProps<E>) {
  const {
    as,
    css,
    className,
    label,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    max: maxProp = 5,
    readOnly = false,
    name: nameProp,
    disabled = false,
    size = 'md',
    labels: labelsProp,
    style,
    ...rest
  } = useThemeProps('Rating', props as RatingProps);
  const labels = { ...RATING_LABELS, ...labelsProp };
  const max = Math.max(1, Math.round(maxProp));
  const [value, setValue] = useControlled<number | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: number | null) => void) | undefined,
  });
  const auto = useId();
  const name = nameProp ?? auto;
  const styled = useCss('Rating', 'root', css);
  const root = useAnimationRoot(rest);
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const icon = ICON[size];
  const clamped = Math.min(max, Math.max(0, value ?? 0));

  if (readOnly) {
    const Root = (as ?? 'span') as ElementType;
    return (
      <>
        {styled.style}
        <Root
          className={cx('slurp-rating', styled.className, className)}
          role="img"
          aria-label={`${label}: ${labels.value(shown(clamped), max)}`}
          data-readonly=""
          data-size={size}
          style={{ '--slurp-rating-ratio': clamped / max, ...style } as CSSProperties}
          {...root}
        >
          <span className="slurp-rating-track" aria-hidden="true">
            {stars.map((n) => (
              <StarIcon key={n} size={icon} className="slurp-rating-icon" />
            ))}
            <span className="slurp-rating-fill">
              {stars.map((n) => (
                <StarIcon key={n} size={icon} className="slurp-rating-icon" fill="currentColor" />
              ))}
            </span>
          </span>
        </Root>
      </>
    );
  }

  const Root = (as ?? 'fieldset') as ElementType;
  const fieldset = Root === 'fieldset';
  const Legend = fieldset ? 'legend' : 'span';
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-rating', styled.className, className)}
        data-size={size}
        data-disabled={disabled ? '' : undefined}
        disabled={fieldset ? disabled : undefined}
        role={fieldset ? undefined : 'radiogroup'}
        aria-labelledby={fieldset ? undefined : `${auto}-label`}
        style={style}
        {...root}
      >
        <Legend id={`${auto}-label`} className="slurp-rating-label">
          {label}
        </Legend>
        <span className="slurp-rating-stars">
          {stars.map((n) => {
            const on = n <= clamped;
            return (
              <label key={n} className="slurp-rating-star" data-on={on ? '' : undefined}>
                <input
                  type="radio"
                  className="slurp-rating-input"
                  name={name}
                  value={n}
                  checked={value === n}
                  disabled={disabled}
                  aria-label={labels.star(n)}
                  onChange={() => setValue(n)}
                />
                <StarIcon
                  size={icon}
                  className="slurp-rating-icon"
                  fill={on ? 'currentColor' : 'none'}
                />
              </label>
            );
          })}
        </span>
      </Root>
    </>
  );
}
