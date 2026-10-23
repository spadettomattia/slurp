import { cx } from '@slurp-ui/utils';
import type { CSSProperties, ElementType } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface StageOwnProps {
  /** Tint of the stage; default the accent. */
  color?: string;
}

export type StageProps<E extends ElementType = 'div'> = PolymorphicProps<E, StageOwnProps>;

/**
 * Stage for any media: a tinted surface with one soft round glow (breathing slowly) and one smooth ring. Photos and
 * placeholder shapes sit on it; round geometry only.
 */
export function Stage<E extends ElementType = 'div'>(props: StageProps<E>) {
  const { as, css, className, color, style, children, ...rest } = useThemeProps(
    'Stage',
    props as StageProps,
  );
  const Root = (as ?? 'div') as ElementType;
  const styled = useCss('Stage', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-stage', styled.className, className)}
        style={{ ...(color ? { '--slurp-stage-color': color } : null), ...style } as CSSProperties}
        {...root}
      >
        <span className="slurp-stage-glow" aria-hidden="true" />
        <span className="slurp-stage-ring" aria-hidden="true" />
        {children}
      </Root>
    </>
  );
}
