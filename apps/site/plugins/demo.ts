// `import Basic from '@demos/button/Basic.tsx?demo'`: the demo component together with its own source, highlighted.
// The page shows the live example and, on request, the exact code that renders it.
import { readFile } from 'node:fs/promises';

import type { Plugin } from 'vite';

import { highlight } from './highlight';

const SUFFIX = '?demo';

/** The source shown to readers: without the lines marked `// hide` and with tidy imports. */
export function readerSource(code: string): string {
  return code
    .split('\n')
    .filter((line) => !line.trimEnd().endsWith('// hide'))
    .join('\n')
    .trim();
}

export function demoPlugin(): Plugin {
  return {
    name: 'slurp-demo',
    enforce: 'pre',
    async resolveId(id, importer) {
      if (!id.endsWith(SUFFIX)) return null;
      const resolved = await this.resolve(id.slice(0, -SUFFIX.length), importer, {
        skipSelf: true,
      });
      return resolved ? `${resolved.id}${SUFFIX}` : null;
    },
    async load(id) {
      if (!id.endsWith(SUFFIX)) return null;
      const file = id.slice(0, -SUFFIX.length);
      this.addWatchFile(file);
      const raw = readerSource(await readFile(file, 'utf8'));
      const html = await highlight(raw, 'tsx');
      return [
        `import { createElement } from 'react';`,
        `import Example from ${JSON.stringify(file)};`,
        `import { Demo } from '~/components/Demo';`,
        `const code = ${JSON.stringify(raw)};`,
        `const html = ${JSON.stringify(html)};`,
        `export default function DemoBlock(props) {`,
        `  return createElement(Demo, { ...props, code, html }, createElement(Example));`,
        `}`,
      ].join('\n');
    },
  };
}
