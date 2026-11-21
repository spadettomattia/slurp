import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Tree',
  component: Tree,
  tags: ['autodocs'],
  args: {
    label: 'Documenti',
    defaultExpanded: ['guide'],
    items: [
      {
        id: 'guide',
        label: 'Guide',
        children: [
          { id: 'start', label: 'Primi passi' },
          { id: 'theme', label: 'Tema' },
        ],
      },
      { id: 'api', label: 'Riferimento', children: [{ id: 'props', label: 'Proprietà' }] },
      { id: 'notes', label: 'Note di rilascio' },
    ],
  },
  parameters: {
    slurp: {
      a11y: [
        'Un `tree` con un solo punto di tabulazione: frecce su/giù per muoversi, destra apre, sinistra chiude o torna al padre.',
        'Home e Fine vanno agli estremi; Invio sceglie. Ogni nodo dichiara `aria-level` e `aria-expanded`.',
      ],
    },
  },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
