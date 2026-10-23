import type { Meta, StoryObj } from '@storybook/react-vite';
import { SwatchGroup } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Swatch',
  component: SwatchGroup,
  tags: ['autodocs'],
  args: {
    label: 'Colore',
    defaultValue: 'night',
    options: [
      { value: 'night', color: '#1f2a44', label: 'Blu notte' },
      { value: 'sand', color: '#d9c7a7', label: 'Sabbia' },
      { value: 'sage', color: '#9bb59a', label: 'Salvia' },
      { value: 'coral', color: '#f0745f', label: 'Corallo' },
    ],
  },
  parameters: {
    slurp: {
      a11y: [
        '`SwatchGroup` è un `radiogroup` con il nome da `label`; ogni `Swatch` è un `radio` che ha come nome il colore (“Blu notte”).',
        'Una sola fermata di Tab, le frecce spostano e selezionano.',
        'Il colore scelto ha un anello accent-ink: non solo il colore del cerchio. Bersaglio di 44px.',
      ],
    },
  },
} satisfies Meta<typeof SwatchGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
