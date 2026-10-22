// A controllable Web Animations stub for jsdom: element.animate() records the keyframes and a manual timeline
// (advance(ms)) moves every live animation, firing onfinish at either end like the real API.

export class FakeAnimation {
  currentTime = 0;
  playbackRate = 1;
  playState: 'running' | 'paused' | 'finished' | 'idle' = 'running';
  onfinish: (() => void) | null = null;
  readonly duration: number;
  readonly direction: string;

  readonly target: Element;
  readonly keyframes: Keyframe[];
  readonly options: KeyframeAnimationOptions;

  constructor(target: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    this.target = target;
    this.keyframes = keyframes;
    this.options = options;
    this.duration = Number(options.duration ?? 0);
    this.direction = options.direction ?? 'normal';
  }

  /** Position on the engine's timeline: 0 = items in place, 1 = fused. */
  get progress() {
    const t = this.duration ? this.currentTime / this.duration : 1;
    return this.direction === 'reverse' ? 1 - t : t;
  }

  cancel() {
    this.playState = 'idle';
  }

  finish() {
    this.currentTime = this.playbackRate > 0 ? this.duration : 0;
    this.end();
  }

  reverse() {
    this.playbackRate *= -1;
    if (this.playState === 'finished') this.playState = 'running';
  }

  tick(ms: number) {
    if (this.playState !== 'running') return;
    this.currentTime += ms * this.playbackRate;
    if (this.playbackRate > 0 && this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      this.end();
    } else if (this.playbackRate < 0 && this.currentTime <= 0) {
      this.currentTime = 0;
      this.end();
    }
  }

  private end() {
    this.playState = 'finished';
    this.onfinish?.();
  }
}

export interface Waapi {
  /** Every animation created since install, in creation order. */
  all: FakeAnimation[];
  live(): FakeAnimation[];
  advance(ms: number): void;
  uninstall(): void;
}

export function installWaapi(): Waapi {
  const all: FakeAnimation[] = [];
  const proto = Element.prototype as { animate?: unknown };
  const original = proto.animate;
  proto.animate = function (
    this: Element,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ) {
    const a = new FakeAnimation(this, keyframes, options);
    all.push(a);
    return a;
  };
  return {
    all,
    live: () => all.filter((a) => a.playState === 'running'),
    advance(ms) {
      for (const a of [...all]) a.tick(ms);
    },
    uninstall() {
      if (original) proto.animate = original;
      else delete proto.animate;
    },
  };
}

/** Gives an element a layout box (jsdom has none). */
export function place(el: HTMLElement, x: number, y: number, width: number, height: number) {
  el.getBoundingClientRect = () =>
    ({
      x,
      y,
      left: x,
      top: y,
      width,
      height,
      right: x + width,
      bottom: y + height,
      toJSON() {},
    }) as DOMRect;
  return el;
}

/** Lets queued microtasks and promise callbacks run. */
export const flush = () => new Promise<void>((r) => setTimeout(r, 0));

/** The value, or a failed test when it is missing (instead of a non-null assertion). */
export function must<T>(value: T | null | undefined): T {
  if (value == null) throw new Error('Expected a value');
  return value;
}
