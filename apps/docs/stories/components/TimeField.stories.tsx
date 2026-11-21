import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeField } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  args: { label: 'Orario di arrivo', defaultValue: '09:30', min: '08:00', max: '18:00', step: 900 },
  parameters: {
    slurp: {
      a11y: [
        'È l’input `time` del browser dentro un Field: tastiera, selettore sul tocco e annunci sono quelli della piattaforma, nella lingua di chi lo usa.',
        'Il valore è sempre `HH:MM`; `min`, `max` e `step` (in secondi) limitano la scelta.',
      ],
    },
  },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
