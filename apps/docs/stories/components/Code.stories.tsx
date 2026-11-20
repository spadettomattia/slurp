import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from '@slurp-ui/react';

const SNIPPET = `import { SlurpProvider } from '@slurp-ui/react';
import '@slurp-ui/react/styles.css';

export function App() {
  return <SlurpProvider>{/* … */}</SlurpProvider>;
}`;

const meta = {
  title: 'Componenti/Code',
  component: Code,
  tags: ['autodocs'],
  args: { filename: 'main.tsx', code: SNIPPET, language: 'tsx' },
  parameters: {
    slurp: {
      a11y: [
        'La regione del codice si raggiunge con Tab e scorre con le frecce; il nome è il file (o la lingua).',
        'Copia dice quando ha funzionato: cambia icona e nome, e lo annuncia in una regione di stato.',
        'Colori dell’evidenziazione dai token, ognuno ≥ 4.5:1 su surface-2.',
      ],
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SenzaNome: Story = {
  name: 'Senza nome file',
  args: { filename: undefined, code: 'pnpm add @slurp-ui/react', language: 'bash' },
};

export const Evidenziato: Story = {
  args: {
    filename: 'theme.ts',
    code: "const theme = createTheme({ accent: 'hue-teal' });",
    html: '<span style="color:var(--shiki-token-keyword)">const</span> theme = <span style="color:var(--shiki-token-function)">createTheme</span>({ accent: <span style="color:var(--shiki-token-string)">\'hue-teal\'</span> });',
  },
};
