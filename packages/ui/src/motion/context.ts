import { createContext } from 'react';

/** Group id given by the nearest <AnimationGroup>. */
export const AnimationGroupContext = createContext<string | null>(null);
