import type { ReactNode } from 'react';

import { AnimationGroupContext } from './context';

export interface AnimationGroupProps {
  /** Group id: `{ group: id }` resolves every element inside that has an animationId. */
  id: string;
  children?: ReactNode;
}

/** Declarative group: descendants with an `animationId` join it. Renders no element. */
export function AnimationGroup({ id, children }: AnimationGroupProps) {
  return <AnimationGroupContext value={id}>{children}</AnimationGroupContext>;
}
