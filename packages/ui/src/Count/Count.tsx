import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface CountOwnProps {
  value: number;
  /** Above it the badge shows `max+`. Default 99. */
  max?: number;
  /**
   * What the number counts, for assistive tech: `(n) => \`${n} filtri attivi\``. The text joins the accessible name
   * of the control around it (a count is never only visual).
   */
  label?: string | ((value: number) => string);
  /** Default `accent`. */
  tone?: 'accent' | 'neutral';
}

export type CountProps<E extends ElementType = 'span'> = PolymorphicProps<E, CountOwnProps>;

/** Count badge. Pair it with `label` so the number is part of the accessible name. */
export function Count<E extends ElementType = 'span'>(props: CountProps<E>) {
  const {
    as,
    css,
    className,
    value,
    max = 99,
    label,
    tone = 'accent',
    ...rest
  } = useThemeProps('Count', props as CountProps);
  const Root = (as ?? 'span') as ElementType;
  const styled = useCss('Count', 'root', css);
  const root = useAnimationRoot(rest);
  const shown = value > max ? `${max}+` : String(value);
  const spoken = typeof label === 'function' ? label(value) : label;
  return (
    <>
      {styled.style}
      <Root className={cx('slurp-count', styled.className, className)} data-tone={tone} {...root}>
        {spoken ? (
          <>
            <span aria-hidden="true">{shown}</span>
            <span className="slurp-visually-hidden">{spoken}</span>
          </>
        ) : (
          shown
        )}
      </Root>
    </>
  );
}
