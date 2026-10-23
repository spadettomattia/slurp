import { CheckIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import type { ChangeEvent, ElementType, ReactNode } from 'react';

import { splitToggleProps, type ToggleInputAttributes } from '../Checkbox/Checkbox';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface SwitchOwnProps
  extends ToggleInputAttributes, PartsProps<'input' | 'track' | 'thumb' | 'label'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** The label: what is switched on. */
  children?: ReactNode;
}

export type SwitchProps<E extends ElementType = 'label'> = PolymorphicProps<E, SwitchOwnProps>;

/** On / off setting that applies at once (`role="switch"`). On = thumb at the end with a check, accent track. */
export function Switch<E extends ElementType = 'label'>(props: SwitchProps<E>) {
  const {
    as,
    css,
    className,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    children,
    parts,
    partProps,
    classNames,
    ...others
  } = useThemeProps('Switch', props as SwitchProps);
  const { input, root: rest } = splitToggleProps(others);
  const [checked, setChecked] = useControlled({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const Root = (as ?? 'label') as ElementType;
  const styled = useCss('Switch', 'root', css);
  const { part, style } = useParts('Switch', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-toggle', 'slurp-switch', styled.className, className)}
        data-state={checked ? 'on' : 'off'}
        data-disabled={input.disabled ? '' : undefined}
        {...root}
      >
        {part('input', 'input', {
          ...input,
          type: 'checkbox',
          role: 'switch',
          className: 'slurp-toggle-input slurp-switch-input',
          checked,
          onChange: (e: ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked),
        })}
        {part('track', 'span', {
          className: 'slurp-switch-track',
          'aria-hidden': true,
          children: part('thumb', 'span', {
            className: 'slurp-switch-thumb',
            children: checked ? <CheckIcon size={14} /> : null,
          }),
        })}
        {children != null && part('label', 'span', { className: 'slurp-toggle-label', children })}
      </Root>
    </>
  );
}
