import { cx } from '@slurp-ui/utils';
import { useId, type ElementType, type ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface FooterOwnProps {
  /** Groups of links (`Footer.Group`), then `Footer.Bottom`. */
  children?: ReactNode;
}

export type FooterProps<E extends ElementType = 'footer'> = PolymorphicProps<E, FooterOwnProps>;

/**
 * The foot of a site: groups of links in columns and a bottom line (legal, version, language). The Dock replaces the
 * header, not the footer.
 */
function FooterRoot<E extends ElementType = 'footer'>(props: FooterProps<E>) {
  const { as, css, className, children, ...rest } = useThemeProps('Footer', props as FooterProps);
  const Root = (as ?? 'footer') as ElementType;
  const styled = useCss('Footer', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-footer', styled.className, className)} {...root}>
        {children}
      </Root>
    </>
  );
}

export interface FooterGroupProps {
  /** Shown as an eyebrow above the links, and names the list. */
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** A column of links under a title. */
function FooterGroup({ title, children, className }: FooterGroupProps) {
  const id = useId();
  return (
    <div className={cx('slurp-footer-group', className)}>
      <p className="slurp-footer-title" id={id}>
        {title}
      </p>
      <ul className="slurp-footer-list" aria-labelledby={id}>
        {children}
      </ul>
    </div>
  );
}

export type FooterLinkProps<E extends ElementType = 'a'> = PolymorphicProps<E>;

/** A link of a group; `as` renders your router's link. */
function FooterLink<E extends ElementType = 'a'>(props: FooterLinkProps<E>) {
  const { as, css: _css, className, ...rest } = props as FooterLinkProps;
  const Root = (as ?? 'a') as ElementType;
  const root = useAnimationRoot(rest);
  return (
    <li>
      <Root className={cx('slurp-footer-link', className)} {...root} />
    </li>
  );
}

/** The bottom line: small print, version, language. */
function FooterBottom({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx('slurp-footer-bottom', className)}>{children}</div>;
}

type FooterComponent = typeof FooterRoot & {
  Group: typeof FooterGroup;
  Link: typeof FooterLink;
  Bottom: typeof FooterBottom;
};

export const Footer = Object.assign(FooterRoot, {
  Group: FooterGroup,
  Link: FooterLink,
  Bottom: FooterBottom,
}) as FooterComponent;
export { FooterBottom, FooterGroup, FooterLink };
