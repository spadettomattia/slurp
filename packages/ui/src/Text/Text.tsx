import type { FontToken } from '@slurp-ui/tokens';
import { cx } from '@slurp-ui/utils';
import type { ElementType } from 'react';

import { useCss, useThemeProps } from '../internal/styled';
import type { PolymorphicProps } from '../lib/polymorphic';

export type TextTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface TextOwnProps {
  /** Type style of the design system. Default `body`. Display styles shrink on phones by themselves. */
  font?: FontToken;
  /** Colour role: `accent` uses accent-ink; status tones are for text that also carries an icon or a word. */
  tone?: TextTone;
  /** Secondary text (`muted`). Default for `caption` and `eyebrow`. */
  muted?: boolean;
}

export type TextProps<E extends ElementType = 'p'> = PolymorphicProps<E, TextOwnProps>;

const ELEMENT: Partial<Record<FontToken, ElementType>> = {
  'display-xl': 'h1',
  'display-l': 'h1',
  'title-xl': 'h2',
  'title-l': 'h3',
  'title-s': 'h4',
  label: 'span',
  caption: 'span',
  eyebrow: 'span',
};

/** Text in one of the type styles. The element follows the style (`display-*` → h1 … `body` → p), `as` changes it. */
export function Text<E extends ElementType = 'p'>(props: TextProps<E>) {
  const {
    as,
    css,
    className,
    font = 'body',
    tone,
    muted,
    ...rest
  } = useThemeProps('Text', props as TextProps);
  const Root: ElementType = as ?? ELEMENT[font] ?? 'p';
  const styled = useCss('Text', 'root', css);
  return (
    <>
      {styled.style}
      <Root
        className={cx('slurp-text', styled.className, className)}
        data-font={font}
        data-tone={tone}
        data-muted={muted === undefined ? undefined : String(muted)}
        {...rest}
      />
    </>
  );
}
