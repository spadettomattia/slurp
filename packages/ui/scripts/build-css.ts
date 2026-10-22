// Assembles dist/styles.css (fonts + tokens, later + component styles) and ships tokens.css and the font files.
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const tokensDist = path.dirname(fileURLToPath(import.meta.resolve('@slurp/tokens/tokens.css')));

const [fonts, tokens] = await Promise.all([
  readFile(path.join(tokensDist, 'fonts.css'), 'utf8'),
  readFile(path.join(tokensDist, 'tokens.css'), 'utf8'),
]);

await Promise.all([
  writeFile(path.join(dist, 'styles.css'), `${fonts}\n${tokens}`),
  writeFile(path.join(dist, 'tokens.css'), tokens),
  cp(path.join(tokensDist, 'fonts'), path.join(dist, 'fonts'), { recursive: true }),
]);

console.log('@slurp/ui: dist/styles.css, dist/tokens.css, dist/fonts');
