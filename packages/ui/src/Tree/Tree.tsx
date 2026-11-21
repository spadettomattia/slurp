import { ChevronRightIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useRef, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface TreeItem {
  id: string;
  label: ReactNode;
  /** Nested items; a node with children expands. */
  children?: TreeItem[];
}

export interface TreeOwnProps {
  /** Names the tree. */
  label: string;
  items: TreeItem[];
  /** The chosen node. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string) => void;
  /** Ids open at first. */
  defaultExpanded?: string[];
}

export type TreeProps<E extends ElementType = 'ul'> = PolymorphicProps<E, TreeOwnProps>;

interface Flat {
  item: TreeItem;
  level: number;
  parent: string | null;
}

/** A nested list (files, categories): one tab stop, arrows move, Right opens, Left closes or goes to the parent. */
export function Tree<E extends ElementType = 'ul'>(props: TreeProps<E>) {
  const {
    as,
    css,
    className,
    label,
    items,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    defaultExpanded = [],
    ...rest
  } = useThemeProps('Tree', props as TreeProps);
  const [value, setValue] = useControlled<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: string | null) => void) | undefined,
  });
  const [open, setOpen] = useState<string[]>(defaultExpanded);
  const [current, setCurrent] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const Root = (as ?? 'ul') as ElementType;
  const styled = useCss('Tree', 'root', css);
  const animated = useAnimationRoot(rest);

  const visible: Flat[] = [];
  const walk = (list: TreeItem[], level: number, parent: string | null) => {
    for (const item of list) {
      visible.push({ item, level, parent });
      if (item.children?.length && open.includes(item.id)) walk(item.children, level + 1, item.id);
    }
  };
  walk(items, 1, null);
  const tabStop = visible.some((v) => v.item.id === current)
    ? current
    : (visible[0]?.item.id ?? null);

  const focusId = (id: string | undefined) => {
    if (!id) return;
    setCurrent(id);
    root.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus();
  };
  const toggle = (id: string, on: boolean) =>
    setOpen((o) => (on ? [...o, id] : o.filter((x) => x !== id)));

  const keys = (e: KeyboardEvent, f: Flat, i: number) => {
    const { item } = f;
    const has = Boolean(item.children?.length);
    const isOpen = open.includes(item.id);
    if (e.key === 'ArrowDown') focusId(visible[i + 1]?.item.id);
    else if (e.key === 'ArrowUp') focusId(visible[i - 1]?.item.id);
    else if (e.key === 'Home') focusId(visible[0]?.item.id);
    else if (e.key === 'End') focusId(visible.at(-1)?.item.id);
    else if (e.key === 'ArrowRight') {
      if (has && !isOpen) toggle(item.id, true);
      else if (has) focusId(visible[i + 1]?.item.id);
    } else if (e.key === 'ArrowLeft') {
      if (has && isOpen) toggle(item.id, false);
      else if (f.parent) focusId(f.parent);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (has) toggle(item.id, !isOpen);
      setValue(item.id);
    } else return;
    e.preventDefault();
  };

  const render = (list: TreeItem[], level: number): ReactNode =>
    list.map((item) => {
      const i = visible.findIndex((v) => v.item.id === item.id);
      const has = Boolean(item.children?.length);
      const isOpen = open.includes(item.id);
      const flat = visible[i];
      return (
        <li key={item.id} role="none">
          <div
            role="treeitem"
            data-id={item.id}
            tabIndex={item.id === tabStop ? 0 : -1}
            aria-level={level}
            aria-expanded={has ? isOpen : undefined}
            aria-selected={value === item.id}
            className="slurp-tree-item"
            style={{ paddingInlineStart: `calc(var(--slurp-space-3) + ${(level - 1) * 20}px)` }}
            onFocus={() => setCurrent(item.id)}
            onKeyDown={(e) => flat && e.target === e.currentTarget && keys(e, flat, i)}
            onClick={() => {
              setCurrent(item.id);
              if (has) toggle(item.id, !isOpen);
              setValue(item.id);
            }}
          >
            <span
              className="slurp-tree-chevron"
              data-open={isOpen ? '' : undefined}
              aria-hidden="true"
            >
              {has && <ChevronRightIcon size={16} />}
            </span>
            <span className="slurp-tree-label">{item.label}</span>
          </div>
          {has && isOpen && (
            <ul role="group" className="slurp-tree-group">
              {render(item.children as TreeItem[], level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <>
      {styled.style}
      <Root
        ref={root}
        role="tree"
        aria-label={label}
        className={cx('slurp-tree', styled.className, className)}
        {...animated}
      >
        {render(items, 1)}
      </Root>
    </>
  );
}
