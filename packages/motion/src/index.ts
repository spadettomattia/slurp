// @slurp-ui/motion — the collapse / expand engine of the Slurp design system (vanilla TS, no React).
// SlurpNode → fixed overlay of droplets → Web Animations → cleanup; a registry resolves ids and groups.
export {
  collapse,
  expand,
  MAX_DROPLETS,
  morph,
  MOTION_DEFAULTS,
  REDUCED_DURATION,
  runningCount,
  slurp,
} from './engine';
export { GOO_AUTO_MAX } from './goo';
export {
  createRegistry,
  measure,
  registry,
  type Handoff,
  type Registry,
  type TargetMeta,
} from './registry';
export { spring, type Spring, type SpringOptions } from './spring';
export type {
  CollapseOptions,
  ExpandOptions,
  GhostKind,
  SlurpAnimation,
  SlurpDefaults,
  SlurpNode,
  SlurpOptions,
  SlurpPhase,
  SlurpRect,
  SlurpRef,
  SlurpResult,
} from './types';
