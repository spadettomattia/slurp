// Bundles src/styles.css (with its @imports inlined) into dist/styles.css, and ships tokens.css and the font files.
import { cp, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const tokensDist = path.dirname(fileURLToPath(import.meta.resolve('@slurp-ui/tokens/tokens.css')));

const IMPORT = /^@import\s+'([^']+)';\s*$/gm;

/** Inlines `@import '<specifier>';` lines, recursively. Bare specifiers resolve like JS imports. */
async function inline(file: string, seen: Set<string>): Promise<string> {
  const text = await readFile(file, 'utf8');
  const parts: string[] = [];
  let last = 0;
  for (const match of text.matchAll(IMPORT)) {
    const spec = match[1] as string;
    const target = spec.startsWith('.')
      ? path.resolve(path.dirname(file), spec)
      : fileURLToPath(import.meta.resolve(spec, pathToFileURL(file).href));
    parts.push(text.slice(last, match.index));
    if (!seen.has(target)) {
      seen.add(target);
      parts.push(await inline(target, seen));
    }
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts.join('');
}

const seen = new Set<string>();
const styles = await inline(path.join(src, 'styles.css'), seen);

// Every component stylesheet must be imported by src/styles.css.
const componentCss = (await readdir(src, { recursive: true }))
  .filter((f) => f.endsWith('.css') && f !== 'styles.css')
  .map((f) => path.join(src, f));
const missing = componentCss.filter((f) => !seen.has(f));
if (missing.length) {
  throw new Error(
    `Not imported by src/styles.css: ${missing.map((f) => path.relative(src, f)).join(', ')}`,
  );
}

await Promise.all([
  writeFile(path.join(dist, 'styles.css'), styles),
  cp(path.join(tokensDist, 'tokens.css'), path.join(dist, 'tokens.css')),
  cp(path.join(tokensDist, 'fonts'), path.join(dist, 'fonts'), { recursive: true }),
]);

console.log(
  `@slurp-ui/react: dist/styles.css (${componentCss.length} component stylesheets), dist/tokens.css, dist/fonts`,
);
