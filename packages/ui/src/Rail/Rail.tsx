import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface RailOwnProps {
  /** Name of the navigation ("Documentazione", "Impostazioni"). */
  label: string;
  children?: ReactNode;
}

export type RailProps<E extends ElementType = 'nav'> = PolymorphicProps<E, RailOwnProps>;

/**
 * Vertical navigation in groups, beside the content on wide screens (the Dock stays the navigation on phones). The
 * current page is highlighted like a ListRow and marked `aria-current="page"`. Put it in a floating Surface.
 */
function RailRoot<E extends ElementType = 'nav'>(props: RailProps<E>) {
  const { as, css, className, label, children, ...rest } = useThemeProps(
    'Rail',
    props as RailProps,
  );
  const Root = (as ?? 'nav') as ElementType;
  const styled = useCss('Rail', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-rail', styled.className, className)} aria-label={label} {...root}>
        {children}
      </Root>
    </>
  );
}

export interface RailGroupProps {
  /** Shown as an eyebrow above the links, and names the list. */
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** A group of links under an optional eyebrow title. */
function RailGroup({ title, children, className }: RailGroupProps) {
  const id = useId();
  return (
    <div className={cx('slurp-rail-group', className)}>
      {title != null && (
        <p className="slurp-rail-group-title" id={id}>
          {title}
        </p>
      )}
      <ul className="slurp-rail-list" aria-labelledby={title != null ? id : undefined}>
        {children}
      </ul>
    </div>
  );
}

export interface RailLinkOwnProps {
  /** The page you are on (a router's NavLink sets `aria-current` itself). */
  current?: boolean;
  children?: ReactNode;
}

export type RailLinkProps<E extends ElementType = 'a'> = PolymorphicProps<E, RailLinkOwnProps>;

/** One link of the rail; `as` renders your router's link. */
function RailLink<E extends ElementType = 'a'>(props: RailLinkProps<E>) {
  const { as, css: _css, className, current, children, ...rest } = props as RailLinkProps;
  const Root = (as ?? 'a') as ElementType;
  const root = useAnimationRoot(rest);
  return (
    <li className="slurp-rail-item">
      <Root
        className={cx('slurp-rail-link', className)}
        aria-current={current ? 'page' : undefined}
        {...root}
      >
        {children}
      </Root>
    </li>
  );
}

type RailComponent = typeof RailRoot & { Group: typeof RailGroup; Link: typeof RailLink };

export const Rail = Object.assign(RailRoot, { Group: RailGroup, Link: RailLink }) as RailComponent;
export { RailGroup, RailLink };
