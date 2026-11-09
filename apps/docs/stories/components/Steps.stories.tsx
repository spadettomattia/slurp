import type { Meta, StoryObj } from '@storybook/react-vite';
import { Steps } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Steps',
  component: Steps,
  tags: ['autodocs'],
  args: {
    defaultValue: 'storage',
    steps: [
      { value: 'model', label: 'Modello', description: 'iPhone 17' },
      { value: 'color', label: 'Colore', description: 'Salvia' },
      { value: 'storage', label: 'Memoria' },
      { value: 'summary', label: 'Riepilogo' },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <Steps {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Un landmark `navigation` (“Passaggi”) con un elenco ordinato; il passaggio corrente ha `aria-current="step"`.',
        'Lo stato è forma + parola: completato = disco pieno con la spunta e “completato” letto dopo l’etichetta; corrente = anello; successivo = numero.',
        'Con `navigable="done"` (predefinito) i passaggi completati sono bottoni per tornare a cambiare una scelta.',
      ],
    },
  },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** One step under the other, for a side column. */
export const Vertical: Story = { args: { orientation: 'vertical' } };
