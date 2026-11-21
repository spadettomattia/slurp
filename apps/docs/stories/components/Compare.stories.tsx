import type { Meta, StoryObj } from '@storybook/react-vite';
import { Compare } from '@slurp-ui/react';

const tile = (bg: string, text: string) => (
  <div
    style={{ background: bg, height: 240, display: 'grid', placeItems: 'center', color: '#fff' }}
  >
    {text}
  </div>
);

const meta = {
  title: 'Componenti/Compare',
  component: Compare,
  tags: ['autodocs'],
  args: { before: tile('#5b5bd6', 'Prima'), after: tile('#2f9e6d', 'Dopo') },
  parameters: {
    layout: 'padded',
    slurp: {
      a11y: [
        'Un vero `input[type=range]` a tutto riquadro: frecce, Home/Fine e tocco funzionano come in ogni slider, con il valore annunciato in percentuale.',
      ],
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Compare {...args} />
    </div>
  ),
} satisfies Meta<typeof Compare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
