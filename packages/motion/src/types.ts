/** A viewport rectangle (what getBoundingClientRect returns, as plain data). */
export interface SlurpRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Serialisable description of one element taking part in a transition. The engine animates nodes, not live elements:
 * a node measured before its element unmounted stays animatable.
 */
export interface SlurpNode {
  /** Viewport coordinates. */
  rect: SlurpRect;
  /** Computed border-radius (top-left), e.g. `"34px"`. */
  radius: string;
  /** Resolved background: the colour of the droplet (the accent when the element has none). */
  fill: string;
  /** Colour the droplet saturates toward while it travels (`--slurp-animation-tint`, else `fill`). */
  tint: string;
  /** Registry id, DOM id or a generated key. */
  key: string;
  /** The element the action is about: it merges last in a collapse and comes out first in an expand. */
  lead?: boolean;
  /** Excluded from the transition: it only fades. */
  disabled?: boolean;
  /** Per-node ghost override. */
  ghost?: GhostKind;
  /** Live element, hidden while its droplet travels. Absent for a snapshot of an unmounted element. */
  el?: HTMLElement;
}

export type GhostKind = 'shape' | 'snapshot';

export type SlurpRef =
  /** A registered animationId, or a DOM id as fallback. */
  | string
  | HTMLElement
  | { current: HTMLElement | null }
  | SlurpNode
  /** Every element registered with this animationGroup, in DOM order. */
  | { group: string };

export type SlurpPhase = 'prepare' | 'travel' | 'fuse' | 'settle';

/**
 * How a transition settled: played to the end, played back to where it started (after reverse()), or cancelled
 * (elements restored).
 */
export type SlurpResult = 'finished' | 'reversed' | 'cancelled';

/** Options that have a default and can be set once (for example by a theme). */
export interface SlurpDefaults {
  /** Total duration in ms. Default 650. */
  duration: number;
  /** Share of the duration (0–0.8) over which the departures are spread. Default 0.35. */
  stagger: number;
  /** Bend of each path: sideways offset at mid-way, as a share of the distance. Default 0.16. */
  curve: number;
  /** Peak horizontal scale of the single element while droplets merge (it grows 3.5× more in height). Default 1.08. */
  swell: number;
  /** Diameter in px of a droplet when it reaches the single element. Default 18. */
  drop: number;
  /** Liquid bridges. `auto` turns them off with more than 24 droplets or on low-end devices. Default `auto`. */
  goo: boolean | 'auto' | { blur?: number; threshold?: number };
  /** `shape`: rect + radius + fill. `snapshot`: a clone of the content that fades in the first 15%. Default `shape`. */
  ghost: GhostKind | ((node: SlurpNode) => HTMLElement);
  /** Departure order: nearest first (default), DOM order, or a comparator. */
  order: 'distance' | 'dom' | ((a: SlurpNode, b: SlurpNode) => number);
  /** `user` follows prefers-reduced-motion (a 150ms fade); `always` / `never` force it. Default `user`. */
  reducedMotion: 'user' | 'always' | 'never';
  /** What happens when a transition starts on elements that are still moving. Default `reverse`. */
  interrupt: 'reverse' | 'cancel' | 'queue';
}

export interface SlurpOptions extends Partial<SlurpDefaults> {
  from: SlurpRef | SlurpRef[];
  to: SlurpRef | SlurpRef[];
  /** Alternative to `animationLead`. */
  lead?: SlurpRef;
  /** Where the overlay is mounted (default `document.body`); also the region marked busy. */
  container?: HTMLElement;
  signal?: AbortSignal;
  onPhase?: (phase: SlurpPhase) => void;
}

export interface SlurpAnimation {
  /** Resolves when the transition settles; never rejects. */
  finished: Promise<SlurpResult>;
  /** Stops at once and restores every element. */
  cancel(): void;
  /** Jumps to the end. */
  finish(): void;
  /** Plays back from where it is (a finished transition starts again the other way). */
  reverse(): SlurpAnimation;
  /** Shows again the elements a finished collapse left hidden. */
  restore(): void;
}

export type CollapseOptions = Omit<SlurpOptions, 'from' | 'to'> & {
  items: SlurpRef | SlurpRef[];
  target: SlurpRef;
};

export type ExpandOptions = Omit<SlurpOptions, 'from' | 'to'> & {
  source: SlurpRef;
  items: SlurpRef | SlurpRef[];
};
