import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface FactOwnProps {
  label: ReactNode;
  value: ReactNode;
}

export type FactProps<E extends ElementType = 'div'> = PolymorphicProps<E, FactOwnProps>;

/** A label/value pair as one soft pill: specs and key facts on detail pages, instead of boxed panels. */
export function Fact<E extends ElementType = 'div'>(props: FactProps<E>) {
  const { as, css, className, label, value, ...rest } = useThemeProps('Fact', props as FactProps);
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Fact', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-fact', styled.className, className)} {...root}>
        <span className="slurp-fact-label">{label}</span>
        <span className="slurp-fact-value">{value}</span>
      </Root>
    </>
  );
}
