import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Shelf } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Shelf',
  component: Shelf,
  tags: ['autodocs'],
  render: (args) => (
    <Shelf {...args}>
      {['Lumen', 'Orbis', 'Nadir', 'Vela'].map((brand, i) => (
        <Card
          key={brand}
          href="#prodotto"
          title={`${brand} Cuffie ${i + 1}`}
          description={brand}
          value={`${59 + i * 70} €`}
          valuePrefix="da"
          badge={i === 2 ? 'Usato' : undefined}
          color="#ef1cac"
        />
      ))}
    </Shelf>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Una lista (`ul`, ogni Card in un `li`): i lettori di schermo dicono quanti elementi contiene.',
        'Colonne da almeno 220px che si adattano allo spazio; l’ordine resta quello dei figli.',
      ],
    },
  },
} satisfies Meta<typeof Shelf>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
