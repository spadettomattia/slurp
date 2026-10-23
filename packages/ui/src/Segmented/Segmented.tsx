import { CheckIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { Fragment, useRef, type ElementType, type ReactNode } from 'react';

import type { ControlSize } from '../Button/Button';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';
import { useForkRef } from '../utils/useForkRef';
import { useRovingFocus } from '../utils/useRovingFocus';

export interface SegmentedOption<V extends string = string> {
  value: V;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedOwnProps<V extends string = string> extends PartsProps<'item'> {
  /** Name of the group ("Vista"). */
  label: string;
  options: SegmentedOption<V>[];
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /** Default `md`. */
  size?: ControlSize;
}

export type SegmentedProps<
  V extends string = string,
  E extends ElementType = 'div',
> = PolymorphicProps<E, SegmentedOwnProps<V>>;

/** One choice among a few: the selected segment is filled with the accent and shows a check. */
export function Segmented<V extends string = string, E extends ElementType = 'div'>(
  props: SegmentedProps<V, E>,
) {
  const {
    as,
    css,
    className,
    label,
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    size = 'md',
    parts,
    partProps,
    classNames,
    ref,
    ...rest
  } = useThemeProps('Segmented', props as unknown as SegmentedProps);
  const [value, setValue] = useControlled<string | undefined>({
    value: valueProp,
    defaultValue: defaultValue ?? options[0]?.value,
    onChange: onValueChange as ((v: string | undefined) => void) | undefined,
  });
  const own = useRef<HTMLElement>(null);
  const { onKeyDown } = useRovingFocus(own, { selector: '[role="radio"]', select: true });
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Segmented', 'root', css);
  const { part, style } = useParts('Segmented', { parts, partProps, classNames });
  const root = useAnimationRoot({ ...rest, ref: useForkRef(ref as never, own) });
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-segmented', styled.className, className)}
        role="radiogroup"
        aria-label={label}
        data-size={size}
        onKeyDown={onKeyDown}
        {...root}
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <Fragment key={o.value}>
              {part('item', 'button', {
                type: 'button',
                role: 'radio',
                'aria-checked': on,
                'data-selected': on || undefined,
                disabled: o.disabled,
                tabIndex: on ? 0 : -1,
                className: 'slurp-segmented-item',
                onClick: () => setValue(o.value),
                children: (
                  <>
                    {(on || o.icon) && (
                      <span className="slurp-segmented-icon" aria-hidden="true">
                        {on ? <CheckIcon size={16} /> : o.icon}
                      </span>
                    )}
                    <span>{o.label}</span>
                  </>
                ),
              })}
            </Fragment>
          );
        })}
      </Root>
    </>
  );
}
