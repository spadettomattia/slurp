import type { Decorator, Preview } from '@storybook/react-vite';

import '@slurp/ui/styles.css';
import './docs.css';

type ThemeMode = 'system' | 'light' | 'dark';

// Same contract as the design system: data-theme on the root wins over prefers-color-scheme; no attribute = system.
const withTheme: Decorator = (Story, context) => {
  const mode = context.globals.theme as ThemeMode;
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
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
  },
  initialGlobals: { theme: 'system' },
  parameters: {
    layout: 'fullscreen',
    // axe must be green: violations fail the story in the test runner.
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['Introduzione', 'Tokens'] },
    },
  },
};

export default preview;
