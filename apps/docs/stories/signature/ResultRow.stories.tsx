import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, ResultRow } from '@slurp-ui/react';

const meta = {
  title: 'Firma/ResultRow',
  component: ResultRow,
  tags: ['autodocs'],
  args: { title: 'Lumen Cuffie 1', meta: 'Audio', value: '59 €' },
  render: (args) => (
    <Flow gap={1} css={{ maxWidth: 480 }}>
      <ResultRow {...args} />
      <ResultRow title="Orbis Smartphone 2" meta="Smartphone" value="369 €" />
    </Flow>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Tutta la riga è un solo controllo: il nome è titolo, meta e valore.',
        'Le righe hanno `data-result`: con `moveFocus` le frecce passano da un risultato all’altro (il Dock lo fa dalla ricerca).',
        'Il media è decorativo.',
      ],
    },
  },
} satisfies Meta<typeof ResultRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
