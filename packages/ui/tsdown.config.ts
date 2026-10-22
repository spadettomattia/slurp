import { libraryConfig } from '@slurp-ui/tsdown-config';
import { defineConfig } from 'tsdown';

export default defineConfig(
  libraryConfig({
    entry: ['src/index.ts', 'src/*/index.ts'],
    // Component modules are client components. No directive on:
    // - barrels (index.js): they only re-export, Next.js rejects `export *` inside a client boundary,
    //   and server components can import them freely;
    // - lib/: server-safe code (createTheme, colour math, css compiler) that server components may call.
    useClient: (fileName) =>
      !/(^|[\\/])index\.js$/.test(fileName) && !/(^|[\\/])lib[\\/]/.test(fileName),
    deps: { alwaysBundle: ['@slurp-ui/utils'] },
  }),
);
