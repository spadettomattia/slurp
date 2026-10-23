import { CheckIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { createContext, useContext, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

const InList = createContext(false);

export type ListProps<E extends ElementType = 'ul'> = PolymorphicProps<E>;

/** A list of ListRows (rows become list items). */
export function List<E extends ElementType = 'ul'>(props: ListProps<E>) {
  const { as, css, className, children, ...rest } = useThemeProps('List', props as ListProps);
  const Root = (as ?? 'ul') as ElementType;
  const styled = useCss('List', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-list', styled.className, className)} {...root}>
        <InList value={Root === 'ul' || Root === 'ol'}>{children}</InList>
      </Root>
    </>
  );
}

export interface ListRowOwnProps extends PartsProps<
  'mark' | 'title' | 'tag' | 'meta' | 'value' | 'action'
> {
  title: ReactNode;
  /** Leading mark (an icon, a logo); default the first letter of the title. */
  mark?: ReactNode;
  meta?: ReactNode;
  /** Trailing value ("9.1", "1.239 €"). */
  value?: ReactNode;
  /** Highlight tag next to the title ("Consigliato"): with a check, never colour alone. */
  tag?: ReactNode;
  /** The row is highlighted: accent-soft with an accent-ink outline, and the tag. */
  highlighted?: boolean;
  /** Text of the trailing link; the row's title is added for assistive tech. */
  actionLabel?: ReactNode;
  href?: string;
}

export type ListRowProps<E extends ElementType = 'div'> = PolymorphicProps<E, ListRowOwnProps>;

/** Row of a list: mark, title (with an optional highlight tag), meta, a trailing value and one action link. */
export function ListRow<E extends ElementType = 'div'>(props: ListRowProps<E>) {
  const {
    as,
    css,
    className,
    title,
    mark,
    meta,
    value,
    tag,
    highlighted = false,
    actionLabel,
    href,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('ListRow', props as ListRowProps);
  const inList = useContext(InList);
  const Root = (as ?? (inList ? 'li' : 'div')) as ElementType;
  const styled = useCss('ListRow', 'root', css);
  const { part, style } = useParts('ListRow', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const initial = typeof title === 'string' ? title.charAt(0) : null;
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-list-row', styled.className, className)}
        data-highlighted={highlighted || undefined}
        {...root}
      >
        {part('mark', 'span', {
          className: 'slurp-list-row-mark',
          'aria-hidden': true,
          children: mark ?? initial,
        })}
        <span className="slurp-list-row-info">
          {part('title', 'span', {
            className: 'slurp-list-row-title',
            children: (
              <>
                {title}
                {tag != null &&
                  part('tag', 'span', {
                    className: 'slurp-list-row-tag',
                    children: (
                      <>
                        <CheckIcon size={12} />
                        {tag}
                      </>
                    ),
                  })}
              </>
            ),
          })}
          {meta != null &&
            part('meta', 'span', { className: 'slurp-list-row-meta', children: meta })}
        </span>
        {value != null &&
          part('value', 'span', { className: 'slurp-list-row-value', children: value })}
        {actionLabel != null &&
          part('action', 'a', {
            className: 'slurp-list-row-action',
            href: href ?? '#',
            // "Vedi" alone repeats on every row: the row's title completes the link's name.
            'aria-label':
              typeof actionLabel === 'string' && typeof title === 'string'
                ? `${actionLabel} ${title}`
                : undefined,
            children: actionLabel,
          })}
      </Root>
    </>
  );
}
