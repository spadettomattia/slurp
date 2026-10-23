import type { Meta, StoryObj } from '@storybook/react-vite';
import { Score } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Score',
  component: Score,
  tags: ['autodocs'],
  args: { score: 9.1, max: 10, size: 96, label: 'Punteggio' },
  parameters: {
    slurp: {
      a11y: [
        'Un’immagine (`role="img"`) con il nome completo: “Punteggio 9.1 su 10”; `label` dice cosa viene valutato.',
        'L’arco pieno è accent-ink (contrasto ≥ 3:1) e la cifra è sempre scritta: il valore non dipende dal disegno.',
      ],
    },
  },
} satisfies Meta<typeof Score>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
