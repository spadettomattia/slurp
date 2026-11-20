import { ChevronLeftIcon, ChevronRightIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { Button } from '../Button/Button';
import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface PageNavLabels {
  /** Name of the navigation. */
  label: string;
  previous: string;
  next: string;
}

export const PAGENAV_LABELS: PageNavLabels = {
  label: 'Pagina precedente e successiva',
  previous: 'Precedente',
  next: 'Successiva',
};

/** A neighbouring page: its title plus the link's props (`href`, or your router link's `to`). */
export type PageNavTarget = { title: ReactNode } & Record<string, unknown>;

export interface PageNavOwnProps {
  previous?: PageNavTarget;
  next?: PageNavTarget;
  /** Renders the links (your router's Link). Default `a`. */
  linkAs?: ElementType;
  labels?: Partial<PageNavLabels>;
}

export type PageNavProps<E extends ElementType = 'nav'> = PolymorphicProps<E, PageNavOwnProps>;

/** Previous and next page at the end of a sequence (a guide, an article series): two soft buttons with the titles. */
export function PageNav<E extends ElementType = 'nav'>(props: PageNavProps<E>) {
  const {
    as,
    css,
    className,
    previous,
    next,
    linkAs = 'a',
    labels: labelsProp,
    ...rest
  } = useThemeProps('PageNav', props as PageNavProps);
  const labels = { ...PAGENAV_LABELS, ...useLabels('PageNav'), ...labelsProp };
  const Root = (as ?? 'nav') as ElementType;
  const styled = useCss('PageNav', 'root', css);
  const root = useAnimationRoot(rest);
  if (!previous && !next) return null;
  const step = (target: PageNavTarget, dir: 'previous' | 'next') => {
    const { title, ...link } = target;
    return (
      <Button
        {...link}
        as={linkAs}
        appearance="soft"
        tone="neutral"
        size="lg"
        className="slurp-page-nav-step"
        data-dir={dir}
        icon={dir === 'previous' ? <ChevronLeftIcon /> : undefined}
        endIcon={dir === 'next' ? <ChevronRightIcon /> : undefined}
      >
        <span className="slurp-page-nav-label">{labels[dir]}</span>
        <span className="slurp-page-nav-title">{title}</span>
      </Button>
    );
  };
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-page-nav', styled.className, className)}
        aria-label={labels.label}
        {...root}
      >
        {previous && step(previous, 'previous')}
        {next && step(next, 'next')}
      </Root>
    </>
  );
}
