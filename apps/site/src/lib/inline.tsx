import { Fragment, type ReactNode } from 'react';

/** The little Markdown of JSDoc lines: `code` and **bold**. */
export function inline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    p.startsWith('`') ? (
      <code key={i}>{p.slice(1, -1)}</code>
    ) : p.startsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}
