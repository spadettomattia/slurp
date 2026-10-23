import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, Filters, Surface } from '@slurp-ui/react';
import { useState } from 'react';

function FiltersDemo() {
  const [used, setUsed] = useState(true);
  const [cheap, setCheap] = useState(false);
  return (
    <Surface css={{ p: 4, maxWidth: 360 }}>
      <Filters
        onReset={() => (setUsed(false), setCheap(false))}
        active={Number(used) + Number(cheap)}
      >
        <Filters.Group label="Condizione">
          <Chip selected={used} onSelectedChange={setUsed}>
            Solo usato
          </Chip>
        </Filters.Group>
        <Filters.Group label="Prezzo">
          <Chip selected={cheap} onSelectedChange={setCheap}>
            Sotto i 500 €
          </Chip>
        </Filters.Group>
      </Filters>
    </Surface>
  );
}

const meta = {
  title: 'Firma/Filters',
  component: Filters,
  subcomponents: { 'Filters.Group': Filters.Group },
  tags: ['autodocs'],
  render: () => <FiltersDemo />,
  parameters: {
    slurp: {
      a11y: [
        'Ogni `Filters.Group` è un `group` con il nome dalla sua etichetta (“Condizione”): i chip dentro sono bottoni con `aria-pressed`.',
        '“Azzera filtri” è disattivato quando non c’è nulla da azzerare (`active` a 0).',
        'Nel Dock sta nel pannello che cresce sopra la barra: il focus ci entra all’apertura.',
      ],
    },
  },
} satisfies Meta<typeof Filters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
