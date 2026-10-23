import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Empty } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Empty',
  component: Empty,
  tags: ['autodocs'],
  args: {
    title: 'Nessun risultato',
    description: 'Prova con meno filtri o un’altra ricerca.',
    action: <Button>Azzera filtri</Button>,
  },
  argTypes: { action: { control: false } },
  parameters: {
    slurp: {
      a11y: [
        '`role="status"`: annunciato con garbo quando compare (per esempio dopo un filtro).',
        'Un solo modo per uscirne (`action`): un bottone con un verbo chiaro.',
        'Il media è decorativo.',
      ],
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
