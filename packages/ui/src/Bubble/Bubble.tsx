import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import type { Appearance, ButtonTone, ControlSize } from '../Button/Button';
import { useAnimationRoot } from '../internal/animation';
import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export interface BubbleOwnProps {
  /** Accessible name: an icon-only button must say what it does (also the tooltip text, if any). */
  label: string;
  /** The icon. */
  children: ReactNode;
  /** Default `plain`. */
  appearance?: Appearance;
  /** Default `neutral`. */
  tone?: ButtonTone;
  /** Default `md` (48px). */
  size?: ControlSize;
}

export type BubbleProps<E extends ElementType = 'button'> = PolymorphicProps<E, BubbleOwnProps>;

/** Round icon-only button. In a Bloom it is the trigger that grows into its panel. */
export function Bubble<E extends ElementType = 'button'>(props: BubbleProps<E>) {
  const {
    as,
    css,
    className,
    label,
    appearance = 'plain',
    tone = 'neutral',
    size = 'md',
    children,
    ...rest
  } = useThemeProps('Bubble', props as BubbleProps);
  const Root = (as ?? 'button') as ElementType;
  const styled = useCss('Bubble', 'root', css);
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-button', 'slurp-bubble', styled.className, className)}
        data-appearance={appearance}
        data-tone={tone}
        data-size={size}
        aria-label={label}
        {...(Root === 'button' ? { type: 'button' } : null)}
        {...root}
      >
        <span className="slurp-button-icon" aria-hidden="true">
          {children}
        </span>
      </Root>
    </>
  );
}
