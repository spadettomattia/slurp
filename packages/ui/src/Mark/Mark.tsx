import { Fragment, type ReactNode } from 'react';

import { matchRanges } from '../lib/layout';

export interface MarkProps {
  /** The text to show. */
  text: string;
  /** The in-page query: every match (case- and accent-insensitive) is wrapped in a mark. */
  query?: string;
}

/**
 * Text with the matches of the in-page search marked (`accent-soft` tint + accent underline; the active one is filled,
 * see useFindInPage). Without a query it renders the plain text.
 */
export function Mark({ text, query = '' }: MarkProps): ReactNode {
  const ranges = matchRanges(text, query);
  if (!ranges.length) return text;
  const parts: ReactNode[] = [];
  let at = 0;
  for (const [start, end] of ranges) {
    if (start > at) parts.push(text.slice(at, start));
    parts.push(
      <mark key={start} className="slurp-mark">
        {text.slice(start, end)}
      </mark>,
    );
    at = end;
  }
  if (at < text.length) parts.push(text.slice(at));
  return <Fragment>{parts}</Fragment>;
}
