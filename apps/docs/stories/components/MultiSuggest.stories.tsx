import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultiSuggest } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/MultiSuggest',
  component: MultiSuggest,
  tags: ['autodocs'],
  args: {
    label: 'Colori',
    hint: 'Scegline quanti vuoi.',
    options: [
      { value: 'rosso', label: 'Rosso' },
      { value: 'verde', label: 'Verde' },
      { value: 'blu', label: 'Blu' },
      { value: 'giallo', label: 'Giallo', description: 'Caldo' },
    ],
  },
  parameters: {
    slurp: {
      a11y: [
        'Un `combobox` con elenco a scelta multipla (`aria-multiselectable`): la lista resta aperta mentre scegli.',
        'Ogni scelta diventa un bottone “Rimuovi …”; Backspace nel campo vuoto toglie l’ultima.',
      ],
    },
  },
} satisfies Meta<typeof MultiSuggest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
