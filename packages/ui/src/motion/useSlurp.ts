import {
  collapse,
  expand,
  morph,
  slurp,
  type CollapseOptions,
  type ExpandOptions,
  type SlurpAnimation,
  type SlurpOptions,
} from '@slurp-ui/motion';
import { useEffect, useMemo, useRef } from 'react';

import { useTheme } from '../internal/context';

export interface SlurpControls {
  /** Generic: from → to (n → 1 collapses, 1 → n expands, 1 → 1 morphs). */
  run(options: SlurpOptions): SlurpAnimation;
  /** n → 1, to go forward: the items collapse into the target. */
  collapse(options: CollapseOptions): SlurpAnimation;
  /** 1 → n, to go back: the source bursts into the items. */
  expand(options: ExpandOptions): SlurpAnimation;
  /** 1 → 1. */
  morph(options: SlurpOptions): SlurpAnimation;
}

/**
 * Starts collapse / expand transitions with the theme's motion defaults (`createTheme({ motion })`).
 * Transitions still running when the component unmounts are cancelled.
 */
export function useSlurp(): SlurpControls {
  const motion = useTheme().motion;
  const running = useRef(new Set<SlurpAnimation>());

  useEffect(() => {
    const set = running.current;
    return () => {
      for (const a of set) a.cancel();
      set.clear();
    };
  }, []);

  return useMemo(() => {
    const track = (a: SlurpAnimation) => {
      running.current.add(a);
      void a.finished.then(() => running.current.delete(a));
      return a;
    };
    return {
      run: (o) => track(slurp({ ...motion, ...o })),
      collapse: (o) => track(collapse({ ...motion, ...o })),
      expand: (o) => track(expand({ ...motion, ...o })),
      morph: (o) => track(morph({ ...motion, ...o })),
    };
  }, [motion]);
}
