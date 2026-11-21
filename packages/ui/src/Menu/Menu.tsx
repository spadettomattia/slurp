import { CheckIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import {
  createContext,
  useContext,
  useId,
  useRef,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Bloom, type BloomOwnProps } from '../Bloom/Bloom';
import { useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { moveFocus } from '../utils/focus';

const MenuContext = createContext<((restoreFocus?: boolean) => void) | null>(null);

export type MenuProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  Omit<BloomOwnProps, 'role' | 'children'> & {
    /** MenuItem elements (other content, like a heading, is allowed too). */
    children?: ReactNode;
  }
>;

/**
 * A list of actions on Bloom: the trigger becomes the menu. Arrow keys move (looping), Home / End go to the ends,
 * Enter or Space run the item, which closes the menu and gives focus back to the trigger.
 */
export function Menu<E extends ElementType = 'div'>(props: MenuProps<E>) {
  const { children, width = 260, className, ...rest } = useThemeProps('Menu', props as MenuProps);
  const list = useRef<HTMLDivElement>(null);
  return (
    <Bloom {...rest} role="menu" width={width} className={cx('slurp-menu', className)}>
      {(close) => (
        <MenuContext value={close}>
          <div
            ref={list}
            className="slurp-menu-list"
            onKeyDown={(e) => moveFocus(e, list.current, '[role^="menuitem"]', { loop: true })}
          >
            {children}
          </div>
        </MenuContext>
      )}
    </Bloom>
  );
}

export interface MenuItemOwnProps {
  /** Runs the action; the menu closes afterwards (unless the handler calls preventDefault). */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  /** The key combination that runs it elsewhere, shown at the end (`⌘K`): a hint, not a binding. */
  shortcut?: string;
  disabled?: boolean;
  /** `danger` for destructive actions (the text says so too). */
  tone?: 'neutral' | 'danger';
  children?: ReactNode;
}

export type MenuItemProps<E extends ElementType = 'button'> = PolymorphicProps<E, MenuItemOwnProps>;

/** One action of a Menu. */
export function MenuItem<E extends ElementType = 'button'>(props: MenuItemProps<E>) {
  const {
    as,
    css: _css,
    className,
    onSelect,
    icon,
    shortcut,
    disabled,
    tone = 'neutral',
    children,
    ...rest
  } = props as MenuItemProps;
  const close = useContext(MenuContext);
  const Root = (as ?? 'button') as ElementType;
  return (
    <Root
      role="menuitem"
      tabIndex={-1}
      className={cx('slurp-bloom-item', className)}
      aria-disabled={disabled || undefined}
      data-tone={tone}
      {...(Root === 'button' ? { type: 'button' } : null)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        onSelect?.(e);
        if (!e.defaultPrevented) close?.(true);
      }}
      {...rest}
    >
      {icon != null && (
        <span className="slurp-bloom-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="slurp-bloom-item-label">{children}</span>
      {shortcut != null && (
        <kbd className="slurp-menu-shortcut" aria-keyshortcuts={shortcut}>
          {shortcut}
        </kbd>
      )}
    </Root>
  );
}

export interface MenuGroupProps {
  /** Names the group (shown above it and read by screen readers). */
  label: string;
  children?: ReactNode;
}

/** A named set of items inside a Menu. */
export function MenuGroup({ label, children }: MenuGroupProps) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="slurp-menu-group">
      <div id={id} className="slurp-menu-group-label" role="presentation">
        {label}
      </div>
      {children}
    </div>
  );
}

/** A line between two sets of items. */
export function MenuSeparator() {
  return <div role="separator" className="slurp-menu-separator" />;
}

export interface MenuCheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  disabled?: boolean;
  /** The shortcut that toggles it elsewhere, shown at the end. */
  shortcut?: string;
  children?: ReactNode;
}

/** An item that is on or off (a view option). The menu stays open when you toggle it. */
export function MenuCheckboxItem({
  checked,
  onCheckedChange,
  icon,
  disabled,
  shortcut,
  children,
}: MenuCheckboxItemProps) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      className="slurp-bloom-item"
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
    >
      <span className="slurp-menu-check" aria-hidden="true">
        {checked && <CheckIcon size={18} />}
      </span>
      {icon != null && (
        <span className="slurp-bloom-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="slurp-bloom-item-label">{children}</span>
      {shortcut != null && (
        <kbd className="slurp-menu-shortcut" aria-keyshortcuts={shortcut}>
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

const RadioContext = createContext<{ value: string; select: (value: string) => void } | null>(null);

export interface MenuRadioGroupProps {
  /** Names the group. */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  children?: ReactNode;
}

/** A set of items of which exactly one is chosen (a sort order). */
export function MenuRadioGroup({ label, value, onValueChange, children }: MenuRadioGroupProps) {
  const id = useId();
  return (
    <RadioContext value={{ value, select: onValueChange }}>
      <div role="group" aria-labelledby={id} className="slurp-menu-group">
        <div id={id} className="slurp-menu-group-label" role="presentation">
          {label}
        </div>
        {children}
      </div>
    </RadioContext>
  );
}

export interface MenuRadioItemProps {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

/** One choice of a `MenuRadioGroup`. */
export function MenuRadioItem({ value, disabled, children }: MenuRadioItemProps) {
  const group = useContext(RadioContext);
  const checked = group?.value === value;
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      className="slurp-bloom-item"
      onClick={() => {
        if (!disabled) group?.select(value);
      }}
    >
      <span className="slurp-menu-check" aria-hidden="true">
        {checked && <CheckIcon size={18} />}
      </span>
      <span className="slurp-bloom-item-label">{children}</span>
    </button>
  );
}

Menu.Item = MenuItem;
Menu.CheckboxItem = MenuCheckboxItem;
Menu.RadioGroup = MenuRadioGroup;
Menu.RadioItem = MenuRadioItem;
Menu.Group = MenuGroup;
Menu.Separator = MenuSeparator;
