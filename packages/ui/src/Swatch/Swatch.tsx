import { cx } from '@slurp-ui/utils';
import { useRef, type ElementType, type MouseEvent } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';
import { useForkRef } from '../utils/useForkRef';
import { useRovingFocus } from '../utils/useRovingFocus';

export interface SwatchOwnProps {
  /** Any CSS colour. */
  color: string;
  /** Name of the colour: the accessible name ("Blu notte"). */
  label: string;
  /** Selected = a ring around it (never colour alone). */
  selected?: boolean;
}

export type SwatchProps<E extends ElementType = 'button'> = PolymorphicProps<E, SwatchOwnProps>;

/** One colour choice: a 44px circle; selected shows an accent-ink ring. Use it inside a SwatchGroup. */
export function Swatch<E extends ElementType = 'button'>(props: SwatchProps<E>) {
  const {
    as,
    css,
    className,
    color,
    label,
    selected = false,
    ...rest
  } = useThemeProps('Swatch', props as SwatchProps);
  const Root = (as ?? 'button') as ElementType;
  const styled = useCss('Swatch', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-swatch', styled.className, className)}
        role="radio"
        aria-checked={selected}
        aria-label={label}
        title={label}
        data-selected={selected || undefined}
        {...(Root === 'button' ? { type: 'button' } : null)}
        {...root}
      >
        <span className="slurp-swatch-fill" style={{ background: color }} />
      </Root>
    </>
  );
}

export interface SwatchOption {
  value: string;
  color: string;
  label: string;
}

export interface SwatchGroupOwnProps {
  /** Name of the group ("Colore"). */
  label: string;
  options: SwatchOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
}

export type SwatchGroupProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  SwatchGroupOwnProps
>;

/** Single colour choice: a radio group of swatches, one tab stop, arrow keys move and select. */
export function SwatchGroup<E extends ElementType = 'div'>(props: SwatchGroupProps<E>) {
  const {
    as,
    css,
    className,
    label,
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    ref,
    ...rest
  } = useThemeProps('SwatchGroup', props as SwatchGroupProps);
  const [value, setValue] = useControlled<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: string | null) => void) | undefined,
  });
  const own = useRef<HTMLElement>(null);
  const { onKeyDown } = useRovingFocus(own, { selector: '[role="radio"]', select: true });
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('SwatchGroup', 'root', css);
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, own) });
  const active = options.some((o) => o.value === value) ? value : options[0]?.value;
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-swatch-group', styled.className, className)}
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        {...root}
      >
        {options.map((o) => (
          <Swatch
            key={o.value}
            color={o.color}
            label={o.label}
            selected={o.value === value}
            tabIndex={o.value === active ? 0 : -1}
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              setValue(o.value);
            }}
          />
        ))}
      </Root>
    </>
  );
}
