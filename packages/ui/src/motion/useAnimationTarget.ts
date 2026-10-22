import { registry, type GhostKind } from '@slurp-ui/motion';
import { useContext, useId, useMemo, type RefCallback } from 'react';

import { AnimationGroupContext } from './context';

/** Accepted by every component: it only registers its root element. Transitions are started by useSlurp(). */
export interface AnimationProps {
  /** Registers the element under this id (a `from` / `to` / `lead` of useSlurp). */
  animationId?: string;
  /** Joins a group (`{ group }` refs). Inside <AnimationGroup>, elements with an animationId join it by themselves. */
  animationGroup?: string;
  /** The element the action is about: it merges last in a collapse and comes out first in an expand. */
  animationLead?: boolean;
  /** Left out of the transition: it is neither hidden nor animated, it only fades. */
  animationDisabled?: boolean;
  /** Ghost override for this element. */
  animationGhost?: GhostKind;
}

/**
 * Ref that registers an element with the motion registry while it is mounted. Undefined when the element has neither
 * an animationId nor an animationGroup: then nothing is registered and nothing is allocated.
 */
export function useAnimationTarget<T extends HTMLElement = HTMLElement>({
  animationId,
  animationGroup,
  animationLead,
  animationDisabled,
  animationGhost,
}: AnimationProps = {}): RefCallback<T> | undefined {
  const inherited = useContext(AnimationGroupContext);
  const auto = useId();
  const id = animationId ?? (animationGroup ? `${animationGroup}:${auto}` : undefined);
  // An inherited group applies only to elements that opted in with an id (not to every Cell in the subtree).
  const group = animationGroup ?? (animationId ? (inherited ?? undefined) : undefined);
  return useMemo(() => {
    if (!id) return undefined;
    const meta = {
      group,
      lead: animationLead,
      disabled: animationDisabled,
      ghost: animationGhost,
    };
    return (el: T | null) => (el ? registry.register(id, el, meta) : undefined);
  }, [id, group, animationLead, animationDisabled, animationGhost]);
}
