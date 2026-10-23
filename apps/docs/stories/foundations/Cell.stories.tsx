import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Text } from '@slurp-ui/react';

const meta = {
  title: 'Fondamenta/Cell',
  component: Cell,
  tags: ['autodocs'],
  render: (args) => (
    <Cell
      {...args}
      as="section"
      aria-label="Esempio di Cell"
      css={{ p: 5, radius: 'md', bg: 'accent-soft', '&:hover': { bg: 'surface-2' } }}
    >
      <Text font="label">Cell con css: p 5, radius md, sfondo accent-soft, hover surface-2</Text>
    </Cell>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Un `div` senza ruolo: scegli l’elemento giusto con `as` (`section` con un nome, `button`, `ul`…), non aggiungere ruoli a un `div`.',
        'Se diventa interattiva con `as="button"`, `type="button"` e il focus visibile sono a carico tuo: per un bottone preferisci `Button`.',
      ],
    },
  },
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The base primitive: any element, styled with `css` (tokens, selectors, breakpoints). */
export const Playground: Story = {};
