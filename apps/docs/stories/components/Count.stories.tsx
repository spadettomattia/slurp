import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Count, Flow } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Count',
  component: Count,
  tags: ['autodocs'],
  args: { value: 3, tone: 'accent', label: (n: number) => `${n} filtri attivi` },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'neutral'] },
    label: { control: false },
  },
  parameters: {
    slurp: {
      a11y: [
        'Con `label` il numero visibile è nascosto e il testo (“3 filtri attivi”) entra nel nome del controllo che lo contiene.',
        'Senza `label` resta solo la cifra: usalo così soltanto quando il contesto dice già cosa conta.',
        'Oltre `max` mostra `99+`, ma `label` riceve sempre il valore esatto.',
      ],
    },
  },
} satisfies Meta<typeof Count>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InUnBottone: Story = {
  name: 'In un bottone',
  render: () => (
    <Flow direction="row" gap={3} align="center">
      <Button appearance="outline" tone="neutral">
        Filtri <Count value={3} label={(n) => `, ${n} attivi`} />
      </Button>
      <Count value={128} tone="neutral" />
      <Count value={240} label={(n) => `${n} notifiche`} />
    </Flow>
  ),
};
