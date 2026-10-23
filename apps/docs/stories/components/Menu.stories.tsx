import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, MenuItem } from '@slurp-ui/react';
import { FiltersIcon } from '@slurp-ui/react/icons';

const meta = {
  title: 'Componenti/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    trigger: (
      <>
        <FiltersIcon /> Azioni
      </>
    ),
  },
  argTypes: { trigger: { control: false } },
  render: (args) => (
    <div style={{ minHeight: 280 }}>
      <Menu {...args}>
        <MenuItem>Modifica</MenuItem>
        <MenuItem>Duplica</MenuItem>
        <MenuItem disabled>Archivia</MenuItem>
        <MenuItem tone="danger">Elimina</MenuItem>
      </Menu>
    </div>
  ),
  parameters: {
    slurp: {
      anatomy: ['Menu', 'Bloom'],
      a11y: [
        'Il pannello è un `menu`, le voci sono `menuitem`; una voce disattivata resta leggibile (`aria-disabled`).',
        'Le frecce si muovono (con ritorno all’inizio), Home / Fine vanno agli estremi, Invio o Spazio eseguono la voce.',
        'Dopo la scelta il menu si chiude e il focus torna sul trigger. `tone="danger"`: anche il testo deve dire che l’azione è distruttiva.',
      ],
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A list of actions on Bloom: the trigger becomes the menu. */
export const Playground: Story = {};
