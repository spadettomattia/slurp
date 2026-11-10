import { useSlurpNavigate, type SlurpNavigateOptions } from '@slurp-ui/react';
import type { MouseEvent } from 'react';
import { useHref, useLinkClickHandler, useNavigate } from 'react-router';

/**
 * Props that make any library component a router link: a real `href` (with the base path, crawlable, opens in a new
 * tab) and a click that navigates in the app. With `slurp` options the click plays the collapse / expand transition
 * (the library's `useSlurpNavigate`); a modified click (new tab, new window) is left to the browser.
 */
export function useLinkProps(to: string, slurp?: SlurpNavigateOptions) {
  const href = useHref(to);
  const click = useLinkClickHandler<HTMLElement>(to);
  const go = useSlurpNavigate(useNavigate());
  const onClick = (e: MouseEvent<HTMLElement>) => {
    if (!slurp) return click(e as MouseEvent<HTMLAnchorElement>);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    void go(to, slurp);
  };
  return { href, onClick };
}

/** Ids of the elements the transition moves between, shared by the routes and the Dock. */
export const motionIds = {
  tile: (section: string) => `tile-${section}`,
  sectionCrumb: (section: string) => `crumb-${section}`,
  row: (slug: string) => `row-${slug}`,
  pageCrumb: (slug: string) => `crumb-page-${slug}`,
  tiles: 'sections',
  rows: 'rows',
};
