// Writes src/generated/{tokens.ts,tokens.css,fonts.css} from src/tokens.json. Run: pnpm generate
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildCss,
  buildFontsCss,
  buildModel,
  buildTs,
  type SlurpTokensSource,
} from './tokens-lib.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'src', 'generated');

const src = JSON.parse(
  await readFile(path.join(root, 'src', 'tokens.json'), 'utf8'),
) as SlurpTokensSource;
const model = buildModel(src);

await mkdir(outDir, { recursive: true });
await Promise.all([
  writeFile(path.join(outDir, 'tokens.ts'), buildTs(model, src)),
  writeFile(path.join(outDir, 'tokens.css'), buildCss(model)),
  writeFile(path.join(outDir, 'fonts.css'), buildFontsCss(model)),
]);

console.log(
  `@slurp/tokens: ${model.entries.length} tokens, ${Object.keys(model.fonts).length} type styles → src/generated`,
);
