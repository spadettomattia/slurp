import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fact, Flow } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Fact',
  component: Fact,
  tags: ['autodocs'],
  args: { label: 'Prezzo', value: '1.239 €' },
  parameters: {
    slurp: {
      a11y: [
        'Etichetta e valore stanno nella stessa pillola e si leggono di seguito (“Prezzo 1.239 €”).',
        'Per un elenco di caratteristiche raggruppa le pillole in una lista (`Flow as="ul"`) o sotto un titolo.',
      ],
    },
  },
} satisfies Meta<typeof Fact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gruppo: Story = {
  render: () => (
    <Flow direction="row" gap={3} wrap>
      <Fact label="Prezzo" value="1.239 €" />
      <Fact label="Peso" value="170 g" />
      <Fact label="Garanzia" value="2 anni" />
    </Flow>
  ),
};
