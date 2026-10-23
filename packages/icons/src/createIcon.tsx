import type { SVGProps } from 'react';

/** A path (`d`) or a circle (`[cx, cy, r]`) of a 24×24 stroke icon. */
export type IconShape = string | readonly [number, number, number];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width and height in px. Default 20. */
  size?: number;
  /**
   * Accessible name. Without it the icon is decorative (`aria-hidden`), which is right whenever text or the
   * control's own name already says what it means.
   */
  title?: string;
}

/** Builds a stroke icon of the design system: 2px stroke, round caps and joins, currentColor. */
export function createIcon(name: string, shapes: readonly IconShape[]) {
  function Icon({ size = 20, title, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
        {...rest}
      >
        {shapes.map((s, i) =>
          typeof s === 'string' ? (
            <path key={i} d={s} />
          ) : (
            <circle key={i} cx={s[0]} cy={s[1]} r={s[2]} />
          ),
        )}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}
