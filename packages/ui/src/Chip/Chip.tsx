import { CheckIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import type { ElementType, MouseEvent, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface ChipOwnProps {
  /** Selected (controlled). Selected = accent fill PLUS a check: never colour alone. */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Leading icon, replaced by the check while selected. */
  icon?: ReactNode;
}

export type ChipProps<E extends ElementType = 'button'> = PolymorphicProps<E, ChipOwnProps>;

/** Toggle chip (filters, options): `aria-pressed` reflects the state. */
export function Chip<E extends ElementType = 'button'>(props: ChipProps<E>) {
  const {
    as,
    css,
    className,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    icon,
    children,
    onClick,
    ...rest
  } = useThemeProps('Chip', props as ChipProps);
  const [selected, setSelected] = useControlled({
    value: selectedProp,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });
  const Root = (as ?? 'button') as ElementType;
  const styled = useCss('Chip', 'root', css);
  const root = useAnimationRoot(rest);
  const mark = selected ? <CheckIcon size={16} /> : icon;
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-chip', styled.className, className)}
        aria-pressed={selected}
        data-selected={selected || undefined}
        {...(Root === 'button' ? { type: 'button' } : null)}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          (onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
          if (!e.defaultPrevented) setSelected(!selected);
        }}
        {...root}
      >
        {mark != null && (
          <span className="slurp-chip-icon" aria-hidden="true">
            {mark}
          </span>
        )}
        <span>{children}</span>
      </Root>
    </>
  );
}
