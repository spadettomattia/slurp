import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

// import.meta.url is not a file URL under jsdom; the directory is.
const src = path.join(import.meta.dirname, '../src');

/** Every component stylesheet: `Button/Button.css` → its text. */
const sheets = readdirSync(src, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => {
    const file = path.join(src, d.name, `${d.name}.css`);
    try {
      return [{ name: `${d.name}.css`, css: readFileSync(file, 'utf8') }];
    } catch {
      return [];
    }
  });

interface Rule {
  selector: string;
  body: string;
  /** The at-rules around it, outermost first (`@layer …`, `@media …`). */
  context: string[];
}

/** A small brace walker: enough for the library's own stylesheets (no strings with braces). */
function parse(css: string): Rule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];
  const stack: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '{') {
      const head = text.slice(start, i).trim();
      if (head.startsWith('@')) {
        stack.push(head);
        start = i + 1;
        continue;
      }
      const end = text.indexOf('}', i);
      rules.push({ selector: head, body: text.slice(i + 1, end), context: [...stack] });
      i = end;
      start = i + 1;
    } else if (c === '}') {
      stack.pop();
      start = i + 1;
    } else if (c === ';' && text.slice(start, i).trim().startsWith('@')) {
      start = i + 1; // statement at-rule, e.g. @layer order
    }
  }
  return rules;
}

const FINE_POINTER = /@media \(hover: hover\) and \(pointer: fine\)/;
const REDUCED = /prefers-reduced-motion: reduce/;
const MOVES = /(?:^|;)\s*(?:transform|translate|scale|rotate)\s*:\s*(?!none)/;

/** Seconds of the `transform` entry of a `transition` declaration, if any. */
function transformDuration(body: string): number | undefined {
  const decl = /(?:^|;)\s*transition\s*:\s*([^;]+)/.exec(body)?.[1];
  if (decl) {
    const entry = decl.split(',').find((e) => e.trim().startsWith('transform'));
    const s = entry && /([\d.]+)s/.exec(entry)?.[1];
    if (s) return Number(s);
  }
  const d = /(?:^|;)\s*transition-duration\s*:\s*([\d.]+)s/.exec(body)?.[1];
  return d ? Number(d) : undefined;
}

describe('component stylesheets', () => {
  it('finds the stylesheets', () => {
    expect(sheets.length).toBeGreaterThan(40);
  });

  it('moves things on hover only where hover is real (a tap leaves :hover on)', () => {
    const offenders = sheets.flatMap(({ name, css }) =>
      parse(css)
        .filter((r) => r.selector.includes(':hover') && MOVES.test(r.body))
        .filter((r) => !r.context.some((c) => FINE_POINTER.test(c) || REDUCED.test(c)))
        .map((r) => `${name}: ${r.selector.replace(/\s+/g, ' ')}`),
    );
    expect(offenders).toEqual([]);
  });

  it('presses faster than it releases', () => {
    const pressable: Record<string, [base: string, active: RegExp]> = {
      'Button.css': ['.slurp-button', /^\.slurp-button:active/],
      'Tile.css': ['.slurp-tile', /^\.slurp-tile:active/],
      'Card.css': ['.slurp-card', /^:is\(a, button\)\.slurp-card:active/],
    };
    for (const [file, [base, active]] of Object.entries(pressable)) {
      const rules = parse(sheets.find((s) => s.name === file)?.css ?? '').filter(
        (r) => !r.context.some((c) => REDUCED.test(c)),
      );
      const release = transformDuration(rules.find((r) => r.selector === base)?.body ?? '');
      const press = transformDuration(rules.find((r) => active.test(r.selector))?.body ?? '');
      expect(press, `${file} press`).toBeDefined();
      expect(release, `${file} release`).toBeDefined();
      expect(press, file).toBeLessThan(release ?? 0);
      expect(press, file).toBeLessThanOrEqual(0.16);
    }
  });

  it('on phones, the Dock shrinks earlier crumbs before the current one', () => {
    const dock = parse(sheets.find((s) => s.name === 'Dock.css')?.css ?? '');
    const giveWay = dock.find(
      (r) =>
        r.context.some((c) => c.includes('max-width: 640px')) &&
        r.selector.includes(':not([data-current], [data-icon])') &&
        /flex-shrink:\s*1000/.test(r.body),
    );
    expect(giveWay).toBeDefined();
    expect(giveWay?.body).toMatch(/min-width:\s*44px/);
  });
});
