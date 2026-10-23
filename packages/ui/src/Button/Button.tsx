import { cx } from '@slurp-ui/utils';
import type { ElementType, ReactNode } from 'react';

import { useAnimationRoot } from '../internal/animation';
import { useCss, useParts, useThemeProps } from '../internal/styled';
import type { PartsProps, PolymorphicProps } from '../lib/polymorphic';

export type Appearance = 'fill' | 'soft' | 'outline' | 'plain';
/** Fills carry `on-accent` content; the design system has no on-* pair for status colours, so buttons stop at these. */
export type ButtonTone = 'accent' | 'neutral';
/** Every size keeps the 44px minimum target. `sm` 44 · `md` 48 · `lg` 56. */
export type ControlSize = 'sm' | 'md' | 'lg';

export interface ButtonOwnProps extends PartsProps<'icon' | 'label' | 'endIcon'> {
  /** Default `fill`. */
  appearance?: Appearance;
  /** Default `accent`. */
  tone?: ButtonTone;
  /** Default `md`. */
  size?: ControlSize;
  /** Leading icon (decorative: hidden from assistive tech). */
  icon?: ReactNode;
  /** Trailing icon (decorative). */
  endIcon?: ReactNode;
  /** Renders a link (`<a href>`) that looks like a button. */
  href?: string;
}

export type ButtonProps<E extends ElementType = 'button'> = PolymorphicProps<E, ButtonOwnProps>;

/** The primary action: a pill with `fill` (accent), `soft`, `outline` or `plain` appearance. */
export function Button<E extends ElementType = 'button'>(props: ButtonProps<E>) {
  const {
    as,
    css,
    className,
    appearance = 'fill',
    tone = 'accent',
    size = 'md',
    icon,
    endIcon,
    href,
    parts,
    partProps,
    classNames,
    children,
    ...rest
  } = useThemeProps('Button', props as ButtonProps);
  const Root = (as ?? (href ? 'a' : 'button')) as ElementType;
  const styled = useCss('Button', 'root', css);
  const { part, style } = useParts('Button', { parts, partProps, classNames });
  const root = useAnimationRoot(rest);
  return (
    <>
      {styled.style}
      {style}
      <Root
        className={cx('slurp-button', styled.className, className)}
        data-appearance={appearance}
        data-tone={tone}
        data-size={size}
        href={href}
        {...(Root === 'button' ? { type: 'button' } : null)}
        {...root}
      >
        {icon != null &&
          part('icon', 'span', {
            className: 'slurp-button-icon',
            'aria-hidden': true,
            children: icon,
          })}
        {children != null && part('label', 'span', { className: 'slurp-button-label', children })}
        {endIcon != null &&
          part('endIcon', 'span', {
            className: 'slurp-button-icon',
            'aria-hidden': true,
            children: endIcon,
          })}
      </Root>
    </>
  );
}
