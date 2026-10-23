import type { Decorator, Preview } from '@storybook/react-vite';
import {
  createTheme,
  Ground,
  SlurpProvider,
  type AccentInput,
  type ColorSchemeMode,
} from '@slurp-ui/react';
import { hue } from '@slurp-ui/react/tokens';

import '@slurp-ui/react/styles.css';
import './docs.css';

// Toolbar → theme. storageKey={null}: the toolbar decides, nothing is remembered between stories.
// Stories with `parameters.slurp.bare` paint their own page (the token pages); the others sit on the Slurp ground.
const withSlurp: Decorator = (Story, context) => {
  const theme = createTheme({
    colorScheme: context.globals.theme as ColorSchemeMode,
    accent: context.globals.accent as AccentInput,
  });
  const bare = (context.parameters.slurp as { bare?: boolean } | undefined)?.bare;
  return (
    <SlurpProvider theme={theme} storageKey={null}>
      <Ground />
      {bare ? (
        <Story />
      ) : (
        <div className="docs-canvas">
          <Story />
        </div>
      )}
    </SlurpProvider>
  );
};

const preview: Preview = {
  decorators: [withSlurp],
  globalTypes: {
    theme: {
      description: 'Tema',
      toolbar: {
        title: 'Tema',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'Automatico' },
          { value: 'light', title: 'Chiaro' },
          { value: 'dark', title: 'Scuro' },
        ],
        dynamicTitle: true,
      },
    },
    accent: {
      description: 'Accento',
      toolbar: {
        title: 'Accento',
        icon: 'paintbrush',
        items: Object.keys(hue).map((name) => ({ value: `hue-${name}`, title: `hue-${name}` })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'system', accent: 'hue-violet' },
  parameters: {
    layout: 'fullscreen',
    // axe must be green: violations fail the story in the test runner.
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: ['Introduzione', 'Tokens', 'Sistema', 'Fondamenta', 'Componenti', 'Animazione'],
      },
    },
  },
};

export default preview;
