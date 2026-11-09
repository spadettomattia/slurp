import type { Meta, StoryObj } from '@storybook/react-vite';
import { Suggest } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Suggest',
  component: Suggest,
  tags: ['autodocs'],
  args: {
    label: 'Modello',
    placeholder: 'Scrivi un modello o una marca…',
    hint: 'Ogni parola, in qualsiasi ordine: “apple 17”, “pixel”.',
    options: [
      { value: 'iphone-17', label: 'iPhone 17', description: 'Apple' },
      { value: 'iphone-17-pro', label: 'iPhone 17 Pro', description: 'Apple' },
      { value: 'pixel-10', label: 'Pixel 10', description: 'Google' },
      { value: 'pixel-10-pro', label: 'Pixel 10 Pro', description: 'Google' },
      { value: 'galaxy-s26', label: 'Galaxy S26', description: 'Samsung' },
      { value: 'galaxy-z-fold', label: 'Galaxy Z Fold 8', description: 'Samsung', disabled: true },
      { value: 'fairphone-6', label: 'Fairphone 6', description: 'Fairphone' },
      { value: 'xperia-1', label: 'Xperia 1 VII', description: 'Sony' },
      { value: 'nothing-3', label: 'Phone (3)', description: 'Nothing' },
    ],
  },
  argTypes: { filter: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 420, minHeight: 460 }}>
      <Suggest {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Un `combobox` con l’etichetta visibile, collegato al suo `listbox` (`aria-controls`); il numero di suggerimenti è annunciato in una regione `status`.',
        'Il focus resta nel campo: frecce su / giù muovono l’opzione attiva (`aria-activedescendant`, le opzioni disattivate si saltano), Invio sceglie, Escape chiude e una seconda volta svuota il campo.',
        'Click fuori o Tab chiudono la lista (`useDismiss`); le corrispondenze sono segnate con `Mark`, l’opzione scelta ha la spunta.',
      ],
    },
  },
} satisfies Meta<typeof Suggest>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The field grows downward into the list of suggestions, on one surface. */
export const Playground: Story = {};

/** Already chosen: the field shows its text and every option is offered again. */
export const Chosen: Story = { args: { defaultValue: 'pixel-10' } };

/** With an error, linked to the field. */
export const Invalid: Story = { args: { error: 'Scegli un modello dall’elenco.' } };
