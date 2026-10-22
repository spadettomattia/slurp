import { libraryConfig } from '@slurp/tsdown-config';
import { defineConfig } from 'tsdown';

export default defineConfig(
  libraryConfig({
    entry: ['src/index.ts', 'src/*/index.ts'],
    // Component modules are client components. Barrels (index.js) stay directive-free: they only re-export,
    // Next.js rejects `export *` inside a client boundary, and server components can import them freely.
    useClient: (fileName) => !/(^|[\\/])index\.js$/.test(fileName),
    deps: { alwaysBundle: ['@slurp/utils'] },
  }),
);
