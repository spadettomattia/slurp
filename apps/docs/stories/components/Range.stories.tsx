import type { Meta, StoryObj } from '@storybook/react-vite';
import { Range } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Range',
  component: Range,
  tags: ['autodocs'],
  args: {
    label: 'Prezzo massimo',
    min: 0,
    max: 2000,
    step: 50,
    defaultValue: 900,
    formatValue: (v: number) => `${v.toLocaleString('it-IT')} €`,
  },
  argTypes: { formatValue: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Range {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Un `<input type="range">` nativo con l’etichetta visibile: frecce, Pagina su / giù, Home e Fine.',
        '`formatValue` dà il testo mostrato e letto (`aria-valuetext`: “900 €”, non “900”).',
        'Il cursore ha un bersaglio di 44px; la parte piena è accent-ink (contrasto 3:1).',
      ],
    },
  },
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
