import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useLabels } from '../internal/labels';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface SkipLinkLabels {
  /** The link's text. */
  label: string;
}

export const SKIPLINK_LABELS: SkipLinkLabels = { label: 'Vai al contenuto' };

export interface SkipLinkOwnProps {
  /** Where it jumps: the id of the main content, with `#`. Default `#content`. */
  href?: string;
  /** Default `labels.label`. */
  children?: ReactNode;
  labels?: Partial<SkipLinkLabels>;
}

export type SkipLinkProps<E extends ElementType = 'a'> = PolymorphicProps<E, SkipLinkOwnProps>;

/**
 * "Skip to content": the first thing Tab reaches on a page. Out of sight until focused, then a pill at the top left.
 * Give the target an id and `tabIndex={-1}` so focus lands on it.
 */
export function SkipLink<E extends ElementType = 'a'>(props: SkipLinkProps<E>) {
  const {
    as,
    css,
    className,
    href = '#content',
    children,
    labels: labelsProp,
    ...rest
  } = useThemeProps('SkipLink', props as SkipLinkProps);
  const labels = { ...SKIPLINK_LABELS, ...useLabels('SkipLink'), ...labelsProp };
  const Root = (as ?? 'a') as ElementType;
  const styled = useCss('SkipLink', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-skip-link', styled.className, className)} href={href} {...root}>
        {children ?? labels.label}
      </Root>
    </>
  );
}
