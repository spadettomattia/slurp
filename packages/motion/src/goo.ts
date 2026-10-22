import type { SlurpDefaults } from './types';

/** Above this many droplets `goo: 'auto'` turns the liquid bridges off. */
export const GOO_AUTO_MAX = 24;
/** Fallback of the `blur-goo` token. */
const DEFAULT_BLUR = 12;
/** Alpha level where the edge of the liquid is drawn: the design system's 22 / −9 matrix. */
const DEFAULT_THRESHOLD = 9 / 22;
const SLOPE = 22;

export interface GooConfig {
  blur: number;
  threshold: number;
}

/** The goo filter to use, or null when the bridges are off. */
export function gooEnabled(goo: SlurpDefaults['goo'], droplets: number): GooConfig | null {
  if (goo === false) return null;
  if (goo === 'auto') {
    const cores = typeof navigator === 'undefined' ? 8 : (navigator.hardwareConcurrency ?? 8);
    if (droplets > GOO_AUTO_MAX || cores <= 4) return null;
  }
  const custom = typeof goo === 'object' ? goo : {};
  return {
    blur: custom.blur ?? tokenBlur(),
    threshold: custom.threshold ?? DEFAULT_THRESHOLD,
  };
}

function tokenBlur(): number {
  if (typeof document === 'undefined') return DEFAULT_BLUR;
  const v = getComputedStyle(document.documentElement).getPropertyValue('--slurp-blur-goo');
  return parseFloat(v) || DEFAULT_BLUR;
}

/** Adds the SVG filter (once per configuration) and returns its id. */
export function ensureGoo({ blur, threshold }: GooConfig, container?: HTMLElement): string {
  const id = `slurp-goo-${Math.round(blur * 10)}-${Math.round(threshold * 1000)}`;
  if (document.getElementById(id)) return id;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML =
    `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">` +
    `<feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="b"/>` +
    `<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${SLOPE} ${-(SLOPE * threshold).toFixed(3)}" result="g"/>` +
    '<feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></defs>';
  (container ?? document.body).appendChild(svg);
  return id;
}
