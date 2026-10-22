import type { ComponentPropsWithRef, ElementType } from 'react';

import type { SlurpCss } from './css';

/** Props shared by every Slurp component: per-instance `css`, plus `className` / `style` forwarded to the root. */
export interface BaseProps {
  /** Per-instance style with design tokens, pseudo selectors and breakpoints. */
  css?: SlurpCss;
}

/**
 * Own props + `as` + the props of the rendered element (ref included, React 19). Unknown props go to the root element.
 */
export type PolymorphicProps<E extends ElementType, Own extends object = object> = Own &
  BaseProps & { as?: E } & Omit<ComponentPropsWithRef<E>, keyof Own | keyof BaseProps | 'as'>;
