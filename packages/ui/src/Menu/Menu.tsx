import { cx } from '@slurp-ui/utils';
import {
  createContext,
  useContext,
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
            onKeyDown={(e) => moveFocus(e, list.current, '[role="menuitem"]', { loop: true })}
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
    </Root>
  );
}

Menu.Item = MenuItem;
