import type { Ref } from 'react';

import { useAnimationTarget, type AnimationProps } from '../motion/useAnimationTarget';
import { useForkRef } from '../utils/useForkRef';

/**
 * Root props of a component without its animation* props, with the element registered for motion when asked.
 * Without animation props the ref passes through untouched.
 */
export function useAnimationRoot<P extends AnimationProps & { ref?: unknown }>(
  props: P,
): Omit<P, keyof AnimationProps> {
  const {
    animationId,
    animationGroup,
    animationLead,
    animationDisabled,
    animationGhost,
    ref,
    ...rest
  } = props;
  const target = useAnimationTarget({
    animationId,
    animationGroup,
    animationLead,
    animationDisabled,
    animationGhost,
  });
  const merged = useForkRef(ref as Ref<HTMLElement> | undefined, target);
  return (merged ? { ...rest, ref: merged } : rest) as Omit<P, keyof AnimationProps>;
}
