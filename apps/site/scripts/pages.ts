// Lays the build out for GitHub Pages, which serves the repository's site at /slurp/ from the artifact's root:
// build/client/slurp/* and build/client/assets go to build/pages/, the SPA shell becomes 404.html (unknown URLs
// still open the app, which shows its "page not found"), and Storybook goes under /storybook when it was built.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const client = path.join(root, 'build/client');
const out = path.join(root, 'build/pages');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(path.join(client, 'slurp'), out, { recursive: true });
cpSync(path.join(client, 'assets'), path.join(out, 'assets'), { recursive: true });
for (const f of ['favicon.svg']) cpSync(path.join(client, f), path.join(out, f));
cpSync(path.join(client, 'index.html'), path.join(out, '404.html'));

const storybook = path.join(root, '../docs/storybook-static');
if (existsSync(storybook)) cpSync(storybook, path.join(out, 'storybook'), { recursive: true });

console.log(`@slurp-ui/site: GitHub Pages layout in ${path.relative(process.cwd(), out)}`);
