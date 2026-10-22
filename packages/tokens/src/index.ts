import { vars, type TokenName } from './generated/tokens';

export * from './generated/tokens';

/** `var(--slurp-<name>)`, with an optional fallback. */
export function cssVar(name: TokenName, fallback?: string): string {
  return fallback === undefined ? `var(${vars[name]})` : `var(${vars[name]}, ${fallback})`;
}
