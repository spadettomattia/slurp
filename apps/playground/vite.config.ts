import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The playground reads @slurp-ui/react and @slurp-ui/motion from their sources: edits show up with HMR, no rebuild.
const pkg = (p: string) => fileURLToPath(new URL(`../../packages/${p}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@slurp-ui\/react$/, replacement: pkg('ui/src/index.ts') },
      { find: /^@slurp-ui\/react\/styles\.css$/, replacement: pkg('ui/src/styles.css') },
      { find: /^@slurp-ui\/react\/([A-Za-z]+)$/, replacement: pkg('ui/src/$1/index.ts') },
      { find: /^@slurp-ui\/motion$/, replacement: pkg('motion/src/index.ts') },
    ],
  },
});
