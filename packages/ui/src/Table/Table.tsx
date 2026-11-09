import { ArrowDownIcon, ArrowUpIcon, SortIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, useMemo, type ElementType, type Key, type ReactNode } from 'react';

import { useTheme } from '../internal/context';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

type Row = object;

export interface TableColumn<R extends Row = Row> {
  /** Identifies the column; also the field read when there is no `cell` or `sortValue`. */
  key: string;
  header: ReactNode;
  /** Content of a cell. Default the field `key` of the row. */
  cell?: (row: R, index: number) => ReactNode;
  /** `end` for numbers and prices (tabular figures). Default `start`. */
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  /** Value compared when sorting. Default the field `key` of the row. */
  sortValue?: (row: R) => string | number | null | undefined;
  /** The cells of this column name their row (`th scope="row"`): usually the first column. */
  rowHeader?: boolean;
  /** CSS width of the column. */
  width?: string | number;
}

export interface TableSort {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface TableLabels {
  /** Shown in place of the rows when there are none. */
  empty: string;
}

export const TABLE_LABELS: TableLabels = { empty: 'Nessun elemento' };

export interface TableOwnProps<R extends Row = Row> extends PartsProps<'table' | 'caption'> {
  /** Title of the table: names it and its scroll region. Hide it with `hideCaption` when a heading already says it. */
  caption: ReactNode;
  hideCaption?: boolean;
  columns: TableColumn<R>[];
  rows: R[];
  /** Stable key of a row. Default its index. */
  rowKey?: (row: R, index: number) => Key;
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  /** The rows are already sorted (by a server): the table only reports `onSortChange`. */
  manualSort?: boolean;
  labels?: Partial<TableLabels>;
}

export type TableProps<R extends Row = Row, E extends ElementType = 'div'> = PolymorphicProps<
  E,
  TableOwnProps<R>
>;

const field = (row: Row, key: string): unknown => (row as Record<string, unknown>)[key];

/**
 * A plain data table, without a frame: hairlines between rows, numbers aligned at the end. Sortable headers are
 * buttons and the sorted column carries `aria-sort`. Wide tables scroll inside a named, focusable region.
 */
export function Table<R extends Row = Row, E extends ElementType = 'div'>(props: TableProps<R, E>) {
  const {
    as,
    css,
    className,
    caption,
    hideCaption = false,
    columns,
    rows,
    rowKey,
    sort: sortProp,
    defaultSort = null,
    onSortChange,
    manualSort = false,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Table', props as unknown as TableProps);
  const labels = { ...TABLE_LABELS, ...labelsProp };
  const [sort, setSort] = useControlled<TableSort | null>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: onSortChange as ((s: TableSort | null) => void) | undefined,
  });
  const { locale } = useTheme();
  const captionId = useId();
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Table', 'root', css);
  const { part, style } = useParts('Table', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);

  const sorted = useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.key);
    if (manualSort || !sort || !column) return rows;
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
    const read = column.sortValue ?? ((r: Row) => field(r, column.key) as string | number);
    const sign = sort.direction === 'ascending' ? 1 : -1;
    // Empty values last whatever the direction; a stable sort keeps ties in their order.
    return [...rows].sort((a, b) => {
      const x = read(a);
      const y = read(b);
      if (x == null || x === '') return y == null || y === '' ? 0 : 1;
      if (y == null || y === '') return -1;
      const d =
        typeof x === 'number' && typeof y === 'number'
          ? x - y
          : collator.compare(String(x), String(y));
      return d * sign;
    });
  }, [rows, columns, sort, manualSort, locale]);

  const toggle = (key: string) =>
    setSort({
      key,
      direction: sort?.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending',
    });

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-table', styled.className, className)}
        role="region"
        aria-labelledby={captionId}
        tabIndex={0}
        {...root}
      >
        {part('table', 'table', {
          className: 'slurp-table-table',
          children: (
            <>
              {part('caption', 'caption', {
                id: captionId,
                className: cx('slurp-table-caption', hideCaption && 'slurp-visually-hidden'),
                children: caption,
              })}
              {columns.some((c) => c.width != null) && (
                <colgroup>
                  {columns.map((c) => (
                    <col key={c.key} style={c.width != null ? { width: c.width } : undefined} />
                  ))}
                </colgroup>
              )}
              <thead>
                <tr>
                  {columns.map((c) => {
                    const on = sort?.key === c.key ? sort.direction : undefined;
                    return (
                      <th
                        key={c.key}
                        scope="col"
                        className="slurp-table-head"
                        data-align={c.align ?? 'start'}
                        aria-sort={on}
                      >
                        {c.sortable ? (
                          <button
                            type="button"
                            className="slurp-table-sort"
                            data-sorted={on ? '' : undefined}
                            onClick={() => toggle(c.key)}
                          >
                            <span>{c.header}</span>
                            <span className="slurp-table-sort-icon" aria-hidden="true">
                              {on === 'ascending' ? (
                                <ArrowUpIcon size={16} />
                              ) : on === 'descending' ? (
                                <ArrowDownIcon size={16} />
                              ) : (
                                <SortIcon size={16} />
                              )}
                            </span>
                          </button>
                        ) : (
                          c.header
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td className="slurp-table-empty" colSpan={columns.length}>
                      {labels.empty}
                    </td>
                  </tr>
                ) : (
                  sorted.map((row, i) => (
                    <tr key={rowKey ? rowKey(row as R, i) : i} className="slurp-table-row">
                      {columns.map((c) => {
                        const Cell = c.rowHeader ? 'th' : 'td';
                        const content = c.cell
                          ? c.cell(row as R, i)
                          : (field(row, c.key) as ReactNode);
                        return (
                          <Cell
                            key={c.key}
                            scope={c.rowHeader ? 'row' : undefined}
                            className="slurp-table-cell"
                            data-align={c.align ?? 'start'}
                          >
                            {content}
                          </Cell>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </>
          ),
        })}
      </Root>
    </>
  );
}
