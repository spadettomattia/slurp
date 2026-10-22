import { libraryConfig } from '@slurp-ui/tsdown-config';
import { defineConfig } from 'tsdown';

export default defineConfig(
  libraryConfig({
    copy: [
      { from: 'src/generated/tokens.css', to: 'dist' },
      { from: 'src/generated/fonts.css', to: 'dist' },
      { from: 'src/tokens.json', to: 'dist' },
      { from: 'src/fonts', to: 'dist' },
    ],
  }),
);
