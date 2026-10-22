// Colour math of the Slurp design system: WCAG contrast, OKLCH, the vivid() accent rule and the runtime accent variables.
// Server-safe (no React, no DOM).
import { hue, type HueToken } from '@slurp/tokens';

/** Linear-light sRGB channel in 0–1 plus alpha. */
interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Dark ink used on light fills (design system: `on-accent` dark). */
const INK = '#111114';
const WHITE = '#ffffff';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const delin = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i;

/** Parses `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()` and `rgba()` into gamma-encoded 0–1 channels. */
function parse(color: string): Rgba {
  const hex = HEX.exec(color.trim())?.[1];
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join('') : hex;
    const n = (i: number) => parseInt(full.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: full.length === 8 ? n(6) : 1 };
  }
  const rgb = RGB.exec(color.trim());
  if (rgb) {
    const alpha = rgb[4];
    const a =
      alpha === undefined ? 1 : alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);
    return { r: Number(rgb[1]) / 255, g: Number(rgb[2]) / 255, b: Number(rgb[3]) / 255, a };
  }
  throw new Error(`Slurp: unsupported colour "${color}" (use #hex or rgb()/rgba())`);
}

const toHex = ({ r, g, b }: Pick<Rgba, 'r' | 'g' | 'b'>): string =>
  `#${[r, g, b]
    .map((v) =>
      Math.round(clamp(v, 0, 1) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

function luminance(color: string): number {
  const { r, g, b, a } = parse(color);
  if (a < 1)
    throw new Error(`Slurp: contrast needs an opaque colour, got "${color}" (composite it first)`);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG 2.x contrast ratio between two opaque colours (1–21). */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Minimum ratios of WCAG 2.2 AA: text 4.5:1, large text (24px+, 19px bold) and non-text (boundaries, focus, marks) 3:1. */
export const CONTRAST_MIN = { text: 4.5, large: 3, ui: 3 } as const;

/** Whether `a` on `b` meets WCAG 2.2 AA for the given use. */
export function meetsContrast(
  a: string,
  b: string,
  use: keyof typeof CONTRAST_MIN = 'text',
): boolean {
  return contrast(a, b) >= CONTRAST_MIN[use];
}

/** Ink for content on a fill: dark or white, whichever contrasts more. */
export function onColor(fill: string): string {
  return contrast(fill, INK) >= contrast(fill, WHITE) ? INK : WHITE;
}

type Lab = [l: number, a: number, b: number];

function toOklab(color: string): Lab {
  const { r, g, b } = parse(color);
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** OKLab → gamma sRGB channels; `null` when out of gamut (unless `clip`). */
function fromOklab([L, A, B]: Lab, clip = false): string | null {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (!clip && rgb.some((v) => v < -0.0001 || v > 1.0001)) return null;
  const [r = 0, g = 0, b = 0] = rgb.map((v) => delin(clamp(v, 0, 1)));
  return toHex({ r, g, b });
}

/**
 * Any source colour → a vivid, accessible accent: same hue, OKLCH chroma ×1.6 (within 0.17–0.26), lightness 0.64–0.74.
 * Near-greys get chroma 0.14. Chroma is lowered until the colour fits sRGB.
 */
export function vivid(color: string): string {
  const [l, a, b] = toOklab(color);
  const c = Math.hypot(a, b);
  const h = Math.atan2(b, a);
  const L = clamp(l, 0.64, 0.74);
  let C = c < 0.02 ? 0.14 : clamp(c * 1.6, 0.17, 0.26);
  let out = fromOklab([L, C * Math.cos(h), C * Math.sin(h)]);
  while (!out && C > 0.02) {
    C -= 0.005;
    out = fromOklab([L, C * Math.cos(h), C * Math.sin(h)]);
  }
  return out ?? toHex(parse(color));
}

/** CSS colour with `amount` (0–1) opacity: `color-mix(in oklab, <color> N%, transparent)`. Works with `var()` too. */
export function alpha(color: string, amount: number): string {
  return `color-mix(in oklab, ${color} ${Math.round(clamp(amount, 0, 1) * 1000) / 10}%, transparent)`;
}

/** `color-mix(in oklab, a weight, b)` computed in JS (for checks; the browser does it at runtime). */
export function mix(a: string, b: string, weight: number): string {
  const [la, aa, ba] = toOklab(a);
  const [lb, ab, bb] = toOklab(b);
  const t = clamp(weight, 0, 1);
  return fromOklab([lb + (la - lb) * t, ab + (aa - ab) * t, bb + (ba - bb) * t], true) as string;
}

/** A translucent colour painted over an opaque one (sRGB source-over), e.g. `surface` over the ground. */
export function composite(top: string, bottom: string): string {
  const t = parse(top);
  const u = parse(bottom);
  return toHex({
    r: t.r * t.a + u.r * (1 - t.a),
    g: t.g * t.a + u.g * (1 - t.a),
    b: t.b * t.a + u.b * (1 - t.a),
  });
}

const isHue = (value: string): value is `hue-${HueToken}` =>
  value.startsWith('hue-') && value.slice(4) in hue;

/** `hue-*` preset → its value as is; any other colour → `vivid(colour)`. */
export function resolveAccent(color: string): string {
  return isHue(color) ? hue[color.slice(4) as HueToken] : vivid(color);
}

/**
 * The accent custom properties for one (already resolved) accent. Derived values reference `--slurp-accent`,
 * so they follow it while it transitions and re-resolve `--slurp-fg` on the element that declares them.
 */
export function accentVars(accent: string): Record<string, string> {
  return {
    '--slurp-accent': accent,
    '--slurp-on-accent': onColor(accent),
    '--slurp-accent-soft': 'color-mix(in oklab, var(--slurp-accent) 16%, transparent)',
    '--slurp-accent-ink': 'color-mix(in oklab, var(--slurp-accent) 45%, var(--slurp-fg))',
    '--slurp-focus': 'var(--slurp-accent-ink)',
  };
}
