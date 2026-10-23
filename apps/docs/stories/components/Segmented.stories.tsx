import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segmented } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  args: {
    label: 'Vista',
    defaultValue: 'grid',
    options: [
      { value: 'grid', label: 'Griglia' },
      { value: 'list', label: 'Lista' },
      { value: 'map', label: 'Mappa' },
    ],
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    slurp: {
      a11y: [
        '`role="radiogroup"` con il nome da `label`; ogni segmento è un `radio` con `aria-checked`.',
        'Una sola fermata di Tab: le frecce spostano e selezionano, con ritorno all’inizio.',
        'Il segmento scelto ha il riempimento accent e la spunta, non solo il colore.',
      ],
    },
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Taglie: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Segmented {...args} size="sm" label="Vista (sm)" />
      <Segmented {...args} label="Vista (md)" />
      <Segmented {...args} size="lg" label="Vista (lg)" />
    </div>
  ),
};
