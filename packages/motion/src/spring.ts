export interface SpringOptions {
  /** Default 200 (the design system uses 140–260). */
  stiffness?: number;
  /** Default 20 (the design system uses 18–24). */
  damping?: number;
  /** Default 1. */
  mass?: number;
  /** Initial velocity, in units of the distance per second. Default 0. */
  velocity?: number;
}

export interface Spring {
  /** CSS `linear()` easing that follows the spring from 0 to 1 (overshoot included). */
  easing: string;
  /** Time in ms until the spring rests within 0.1% of its target. */
  duration: number;
  /** Position at `t` ms (0 → 1). */
  at(t: number): number;
}

const MAX_DURATION = 3000;

/** Damped harmonic oscillator from 0 to 1, solved analytically. */
export function spring({
  stiffness = 200,
  damping = 20,
  mass = 1,
  velocity = 0,
}: SpringOptions = {}): Spring {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const v0 = velocity;
  // x(t) = displacement from the target, starting at -1 with velocity v0.
  const offset = (s: number): number => {
    if (zeta < 1) {
      const wd = w0 * Math.sqrt(1 - zeta * zeta);
      return (
        Math.exp(-zeta * w0 * s) * (-Math.cos(wd * s) + ((v0 - zeta * w0) / wd) * Math.sin(wd * s))
      );
    }
    if (zeta === 1) return Math.exp(-w0 * s) * (-1 + (v0 - w0) * s);
    const r = w0 * Math.sqrt(zeta * zeta - 1);
    const a = -zeta * w0 + r;
    const b = -zeta * w0 - r;
    const c2 = (v0 + a) / (b - a);
    return -(1 + c2) * Math.exp(a * s) + c2 * Math.exp(b * s);
  };
  const at = (t: number) => 1 + offset(t / 1000);

  let duration = MAX_DURATION;
  // Rest = within 0.1% and staying there for 50ms.
  for (let t = 0, still = 0; t <= MAX_DURATION; t += 10) {
    still = Math.abs(1 - at(t)) < 0.001 ? still + 10 : 0;
    if (still >= 50) {
      duration = t - 40;
      break;
    }
  }

  const steps = Math.min(60, Math.max(12, Math.round(duration / 16)));
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const v = i === steps ? 1 : at((duration * i) / steps);
    points.push(String(Math.round(v * 1000) / 1000));
  }
  return { easing: `linear(${points.join(', ')})`, duration, at };
}
