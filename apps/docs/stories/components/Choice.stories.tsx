import type { Meta, StoryObj } from '@storybook/react-vite';
import { Choice } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Choice',
  component: Choice,
  tags: ['autodocs'],
  args: {
    label: 'Ordina per',
    defaultValue: 'relevance',
    options: [
      { value: 'relevance', label: 'Rilevanza' },
      { value: 'price-asc', label: 'Prezzo crescente' },
      { value: 'price-desc', label: 'Prezzo decrescente' },
      { value: 'score', label: 'Punteggio', disabled: true },
    ],
  },
  render: (args) => (
    <div style={{ minHeight: 320 }}>
      <Choice {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Il bottone (con l’etichetta visibile) si apre in un `listbox`: le opzioni sono `option` con `aria-selected`.',
        'Frecce su / giù per muoversi, Invio o Spazio per scegliere; Escape chiude e riporta il focus sul bottone.',
        'L’opzione scelta ha la spunta, non solo il colore. Con `name`, un input nascosto porta il valore nel form.',
      ],
    },
  },
} satisfies Meta<typeof Choice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A select on Bloom: the button grows into the list of options. */
export const Playground: Story = {};
