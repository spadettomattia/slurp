import { CheckIcon, MinusIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useCallback, type ChangeEvent, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

/** Props of the native input, shared by Checkbox, Radio and Switch. */
export interface ToggleInputAttributes {
  name?: string;
  /** Submitted value. */
  value?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** id of the input. */
  id?: string;
}

const TOGGLE_KEYS = ['name', 'value', 'required', 'disabled', 'autoFocus', 'id'] as const;

/** Splits the native input's props from the root's. */
export function splitToggleProps<P extends object>(props: P) {
  const input: Record<string, unknown> = {};
  const root: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if ((TOGGLE_KEYS as readonly string[]).includes(k)) input[k] = v;
    else root[k] = v;
  }
  return { input, root };
}

export interface CheckboxOwnProps
  extends ToggleInputAttributes, PartsProps<'input' | 'box' | 'label'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Mixed state (part of a set is checked): a dash instead of the check. */
  indeterminate?: boolean;
  /** The label. */
  children?: ReactNode;
}

export type CheckboxProps<E extends ElementType = 'label'> = PolymorphicProps<E, CheckboxOwnProps>;

/** Native checkbox with the design system's box: checked = accent fill + check (a shape, not only colour). */
export function Checkbox<E extends ElementType = 'label'>(props: CheckboxProps<E>) {
  const {
    as,
    css,
    className,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    indeterminate = false,
    children,
    parts,
    partProps,
    classNames,
    ...others
  } = useThemeProps('Checkbox', props as CheckboxProps);
  const { input, root: rest } = splitToggleProps(others);
  const [checked, setChecked] = useControlled({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const syncIndeterminate = useCallback(
    (el: HTMLInputElement | null) => {
      if (el) el.indeterminate = indeterminate;
    },
    [indeterminate],
  );
  const Root = (as ?? 'label') as ElementType;
  const styled = useCss('Checkbox', 'root', css);
  const { part, style } = useParts('Checkbox', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const state = indeterminate ? 'mixed' : checked ? 'on' : 'off';
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-toggle', 'slurp-checkbox', styled.className, className)}
        data-state={state}
        data-disabled={input.disabled ? '' : undefined}
        {...root}
      >
        {part('input', 'input', {
          ...input,
          ref: syncIndeterminate,
          type: 'checkbox',
          className: 'slurp-toggle-input',
          checked,
          onChange: (e: ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked),
        })}
        {part('box', 'span', {
          className: 'slurp-checkbox-box',
          'aria-hidden': true,
          children:
            state === 'mixed' ? (
              <MinusIcon size={16} />
            ) : state === 'on' ? (
              <CheckIcon size={16} />
            ) : null,
        })}
        {children != null && part('label', 'span', { className: 'slurp-toggle-label', children })}
      </Root>
    </>
  );
}
