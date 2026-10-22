import axe from 'axe-core';
import { expect } from 'vitest';

/** Runs axe on a rendered tree. jsdom has no layout or paint: colour contrast is checked by the contrast suite and Storybook. */
export async function expectNoAxeViolations(node: Element) {
  const result = await axe.run(node, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
