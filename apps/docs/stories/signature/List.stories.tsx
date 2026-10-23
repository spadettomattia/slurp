import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, ListRow } from '@slurp-ui/react';

const meta = {
  title: 'Firma/List',
  component: ListRow,
  subcomponents: { List },
  tags: ['autodocs'],
  args: {
    title: 'Spedizione gratuita',
    meta: 'Consegna in 24 ore',
    tag: 'Consigliato',
    highlighted: true,
    value: '0 €',
    actionLabel: 'Dettagli',
    href: '#spedizione',
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <List>
        <ListRow {...args} />
        <ListRow
          title="Ritiro in negozio"
          meta="Pronto in 2 ore"
          value="0 €"
          actionLabel="Dettagli"
          href="#ritiro"
        />
      </List>
    </div>
  ),
  parameters: {
    slurp: {
      anatomy: ['ListRow'],
      a11y: [
        '`List` è una lista: ogni riga diventa un elemento.',
        'Il link dell’azione ha come nome il suo testo più il titolo della riga (“Dettagli Spedizione gratuita”), quando entrambi sono testo: tanti “Dettagli” restano distinguibili.',
        'La riga evidenziata ha il contorno accent-ink e il tag con la spunta, non solo il colore.',
      ],
    },
  },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
