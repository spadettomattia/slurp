/** Slant of the cut between two crumbs: 20°. */
export const CRUMB_TAN = Math.tan((20 * Math.PI) / 180);

export type CrumbEnd = 'round' | 'slant';

/**
 * One SVG path for a breadcrumb piece of size w×h. Each end is `round` (a semicircle) or `slant` (a 20° cut with
 * rounded corners), centred on the box edge like skewX, so two neighbouring cuts stay parallel. The SVG is
 * w + h·tan20° wide, shifted left by half of that.
 */
export function crumbPath(
  w: number,
  h: number,
  left: CrumbEnd,
  right: CrumbEnd,
  radius = 12,
): string {
  const s = h * CRUMB_TAN;
  const o = s / 2;
  const cap = h / 2;
  const pts: [number, number, number][] = [
    left === 'round' ? [o, 0, cap] : [s, 0, radius],
    right === 'round' ? [o + w, 0, cap] : [o + w + o, 0, radius],
    right === 'round' ? [o + w, h, cap] : [w, h, radius],
    left === 'round' ? [o, h, cap] : [0, h, radius],
  ];
  const k = 0.5523;
  const f = (v: number) => v.toFixed(2);
  let d = '';
  pts.forEach((p, i) => {
    const pr = pts[(i + pts.length - 1) % pts.length] as [number, number, number];
    const nx = pts[(i + 1) % pts.length] as [number, number, number];
    const lp = Math.hypot(pr[0] - p[0], pr[1] - p[1]);
    const ln = Math.hypot(nx[0] - p[0], nx[1] - p[1]);
    const r = Math.min(p[2], lp / 2, ln / 2);
    const a = [p[0] + ((pr[0] - p[0]) / lp) * r, p[1] + ((pr[1] - p[1]) / lp) * r] as const;
    const b = [p[0] + ((nx[0] - p[0]) / ln) * r, p[1] + ((nx[1] - p[1]) / ln) * r] as const;
    d +=
      `${i ? 'L' : 'M'}${f(a[0])} ${f(a[1])}` +
      `C${f(a[0] + (p[0] - a[0]) * k)} ${f(a[1] + (p[1] - a[1]) * k)} ` +
      `${f(b[0] + (p[0] - b[0]) * k)} ${f(b[1] + (p[1] - b[1]) * k)} ${f(b[0])} ${f(b[1])}`;
  });
  return `${d}Z`;
}
