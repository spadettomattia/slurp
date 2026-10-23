import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Progress } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { label: 'Caricamento foto', value: 62, showValue: true, shape: 'bar' },
  argTypes: { shape: { control: 'inline-radio', options: ['bar', 'ring'] } },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Progress {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        '`role="progressbar"` con il nome da `label` e `aria-valuenow` / `aria-valuemax`; `formatValue` dà il testo letto.',
        'Senza `value` è indeterminato: nessun valore annunciato, e con `prefers-reduced-motion` non scorre.',
        'La parte piena è accent-ink (contrasto ≥ 3:1).',
      ],
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Forme: Story = {
  render: () => (
    <Flow gap={5} css={{ maxWidth: 420 }}>
      <Progress label="Ricerca in corso" />
      <Flow direction="row" gap={5} align="center">
        <Progress
          label="Spazio usato"
          value={7.4}
          max={10}
          shape="ring"
          size={64}
          showValue
          formatValue={(v) => v.toFixed(1)}
        />
        <Progress label="Attesa" shape="ring" />
      </Flow>
    </Flow>
  ),
};
