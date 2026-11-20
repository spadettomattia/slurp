import { cx } from '@slurp-ui/utils';
import { Fragment, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';
import { useScrollSpy } from '../utils/useScrollSpy';

export interface ContentsLabels {
  /** The visible title and the name of the navigation. */
  title: string;
}

export const CONTENTS_LABELS: ContentsLabels = { title: 'In questa pagina' };

export interface ContentsItem {
  /** Id of the heading (the link goes to `#id`). */
  id: string;
  label: ReactNode;
  /** 2 (default) or 3: a level-3 item is indented under its section. */
  level?: 2 | 3;
}

export interface ContentsOwnProps extends PartsProps<'title' | 'list' | 'item' | 'link'> {
  items: readonly ContentsItem[];
  /**
   * The section being read. Leave it out to follow the scroll (`useScrollSpy`); pass it to drive it yourself (`null`
   * for none).
   */
  active?: string | null;
  /** Hide the visible title (the navigation keeps its name). */
  hideTitle?: boolean;
  /** Called when a link is followed (e.g. to close the panel it sits in). */
  onNavigate?: (id: string) => void;
  labels?: Partial<ContentsLabels>;
}

export type ContentsProps<E extends ElementType = 'nav'> = PolymorphicProps<E, ContentsOwnProps>;

/**
 * "On this page": links to a page's sections, the one being read highlighted like a ListRow (accent-soft with an
 * accent-ink outline) and marked `aria-current="location"`. Hidden with fewer than two items.
 */
export function Contents<E extends ElementType = 'nav'>(props: ContentsProps<E>) {
  const {
    as,
    css,
    className,
    items,
    active: activeProp,
    hideTitle = false,
    onNavigate,
    labels: labelsProp,
    parts,
    partProps,
    classNames,
    ...rest
  } = useThemeProps('Contents', props as ContentsProps);
  const labels = { ...CONTENTS_LABELS, ...useLabels('Contents'), ...labelsProp };
  const Root = (as ?? 'nav') as ElementType;
  const styled = useCss('Contents', 'root', css);
  const { part, style } = useParts('Contents', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  const spied = useScrollSpy(activeProp === undefined ? items.map((i) => i.id) : []);
  const active = activeProp === undefined ? spied : activeProp;

  if (items.length < 2) return null;
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-contents', styled.className, className)}
        aria-label={labels.title}
        {...root}
      >
        {!hideTitle &&
          part('title', 'p', {
            className: 'slurp-contents-title',
            'aria-hidden': true,
            children: labels.title,
          })}
        {part('list', 'ul', {
          className: 'slurp-contents-list',
          children: items.map((item) => (
            <Fragment key={item.id}>
              {part('item', 'li', {
                className: 'slurp-contents-item',
                'data-level': item.level ?? 2,
                children: part('link', 'a', {
                  className: 'slurp-contents-link',
                  href: `#${item.id}`,
                  'aria-current': item.id === active ? 'location' : undefined,
                  onClick: () => onNavigate?.(item.id),
                  children: item.label,
                }),
              })}
            </Fragment>
          )),
        })}
      </Root>
    </>
  );
}
