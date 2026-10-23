import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, Flow, Text, VisuallyHidden } from '@slurp-ui/react';
import { SearchIcon } from '@slurp-ui/react/icons';

const meta = {
  title: 'Componenti/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  args: { children: '(si apre in una nuova scheda)' },
  render: (args) => (
    <Text>
      Manuale d’uso <VisuallyHidden {...args} />
    </Text>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Letto dai lettori di schermo, non mostrato: per contesto che la vista dà già (“3 filtri attivi”, “si apre in una nuova scheda”).',
        'Non nasconderci contenuti interattivi: un controllo che si raggiunge con Tab deve essere visibile al focus.',
      ],
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Esempio: Story = {
  name: 'Accanto a un’icona',
  render: () => (
    <Flow direction="row" gap={3} align="center">
      <Bubble label="Cerca">
        <SearchIcon />
      </Bubble>
      <Text font="caption" muted>
        Il nome “Cerca” è nel bottone (<code>label</code>); VisuallyHidden serve per il testo
        attorno.
      </Text>
    </Flow>
  ),
};
