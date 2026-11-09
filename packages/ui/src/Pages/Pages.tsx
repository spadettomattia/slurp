import { ChevronLeftIcon, ChevronRightIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { Fragment, type ElementType, type MouseEvent } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useControlled } from '../utils/useControlled';

export interface PagesLabels {
  /** Name of the navigation landmark. */
  label: string;
  previous: string;
  next: string;
  /** Name of a page link ("Pagina 3"). */
  page: (page: number) => string;
  /** Where you are, shown on phones instead of the numbers ("3 di 12"). */
  status: (page: number, count: number) => string;
}

export const PAGES_LABELS: PagesLabels = {
  label: 'Pagine',
  previous: 'Pagina precedente',
  next: 'Pagina successiva',
  page: (n) => `Pagina ${n}`,
  status: (n, count) => `${n} di ${count}`,
};

export interface PagesOwnProps extends PartsProps<
  'list' | 'item' | 'previous' | 'next' | 'status'
> {
  /** Number of pages. */
  count: number;
  /** Current page, from 1. */
  page?: number;
  /** Default 1. */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current one. Default 1. */
  siblings?: number;
  /** Pages always shown at each end. Default 1. */
  boundaries?: number;
  /** URL of a page: the items become links (crawlable, open in a new tab). */
  href?: (page: number) => string;
  disabled?: boolean;
  labels?: Partial<PagesLabels>;
}

export type PagesProps<E extends ElementType = 'nav'> = PolymorphicProps<E, PagesOwnProps>;

/** A page number or a gap ("…") standing for the pages left out. */
export type PageItem = number | 'gap';

const span = (from: number, to: number) =>
  Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);

/**
 * The items of a pagination: the ends, a window around the current page and a gap where pages are left out. The length
 * stays the same whatever the page, so the controls never jump; a gap never stands for a single page.
 */
export function pageItems(page: number, count: number, siblings = 1, boundaries = 1): PageItem[] {
  const slots = 2 * boundaries + 2 * siblings + 3;
  if (count <= slots) return span(1, count);
  const lo = Math.min(
    Math.max(page - siblings, boundaries + 2),
    count - boundaries - 1 - 2 * siblings,
  );
  const hi = lo + 2 * siblings;
  const left: PageItem[] =
    lo === boundaries + 2 ? span(1, boundaries + 1) : [...span(1, boundaries), 'gap'];
  const right: PageItem[] =
    hi === count - boundaries - 1
      ? span(count - boundaries, count)
      : ['gap', ...span(count - boundaries + 1, count)];
  return [...left, ...span(lo, hi), ...right];
}

/**
 * Pagination: previous, the page numbers (the current one filled, `aria-current="page"`) and next. On phones only
 * previous, "3 di 12" and next. With `href` every item is a real link.
 */
export function Pages<E extends ElementType = 'nav'>(props: PagesProps<E>) {
  const {
    as,
    css,
    className,
    count: countProp,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    siblings = 1,
    boundaries = 1,
    href,
    disabled = false,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Pages', props as PagesProps);
  const labels = { ...PAGES_LABELS, ...labelsProp };
  const count = Math.max(1, Math.floor(countProp));
  const [raw, setPage] = useControlled({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const page = Math.min(count, Math.max(1, raw));
  const Root = (as ?? 'nav') as ElementType;
  const styled = useCss('Pages', 'root', css);
  const { part, style } = useParts('Pages', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);

  /** A link or a button that goes to `to`; unavailable (the ends, disabled) it keeps its place but does nothing. */
  const control = (to: number, off: boolean) => {
    const go = (e: MouseEvent) => {
      if (off) {
        e.preventDefault();
        return;
      }
      if (to !== page) setPage(to);
    };
    if (href) {
      return off
        ? { 'aria-disabled': true, role: 'link', onClick: go }
        : { href: href(to), onClick: go };
    }
    return { type: 'button', disabled: off, onClick: go };
  };
  const Tag = href ? 'a' : 'button';

  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-pages', styled.className, className)}
        aria-label={labels.label}
        data-disabled={disabled ? '' : undefined}
        {...root}
      >
        {part('previous', Tag, {
          ...control(page - 1, disabled || page <= 1),
          className: 'slurp-pages-step',
          'aria-label': labels.previous,
          children: <ChevronLeftIcon size={20} />,
        })}
        {part('list', 'ul', {
          className: 'slurp-pages-list',
          children: pageItems(page, count, siblings, boundaries).map((item, i) => (
            <li key={item === 'gap' ? `gap-${i}` : item}>
              {item === 'gap' ? (
                <span className="slurp-pages-gap" aria-hidden="true">
                  …
                </span>
              ) : (
                <Fragment>
                  {part('item', Tag, {
                    ...control(item, disabled),
                    className: 'slurp-pages-item',
                    'aria-label': labels.page(item),
                    'aria-current': item === page ? 'page' : undefined,
                    children: item,
                  })}
                </Fragment>
              )}
            </li>
          )),
        })}
        {part('status', 'span', {
          className: 'slurp-pages-status',
          children: labels.status(page, count),
        })}
        {part('next', Tag, {
          ...control(page + 1, disabled || page >= count),
          className: 'slurp-pages-step',
          'aria-label': labels.next,
          children: <ChevronRightIcon size={20} />,
        })}
      </Root>
    </>
  );
}
