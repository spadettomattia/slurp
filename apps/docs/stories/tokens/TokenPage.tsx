import type { ReactNode } from 'react';

import { usage, vars, type TokenName } from '@slurp/ui/tokens';

/** Paints the page on the Slurp ground, so stories read the same in the canvas and inside Docs pages. */
export function TokenPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <main className="docs-page">
      <h1>{title}</h1>
      <p className="docs-lead">{lead}</p>
      {children}
    </main>
  );
}

export function VarName({ name }: { name: TokenName }) {
  return <code className="docs-code">{vars[name]}</code>;
}

export function Usage({ name }: { name: TokenName }) {
  const text = usage[name];
  return text ? <p className="docs-muted">{text}</p> : null;
}

/** `{ light, dark }` → "light · dark", plain string as is. */
export function formatValue(value: string | { light: string; dark: string }): string {
  return typeof value === 'string' ? value : `${value.light} · ${value.dark}`;
}
