import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rail, Surface } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Rail',
  component: Rail,
  tags: ['autodocs'],
  args: { label: 'Documentazione' },
  parameters: {
    slurp: {
      a11y: [
        'Una `nav` con nome; ogni gruppo è una lista che prende il nome dal suo titolo.',
        'La pagina corrente ha `aria-current="page"` e un contorno: non solo colore.',
        'Sul telefono la navigazione resta nel Dock.',
      ],
    },
  },
  render: (args) => (
    <Surface level="dock" radius="panel" css={{ p: 3, maxWidth: 272 }}>
      <Rail {...args}>
        <Rail.Group title="Per iniziare">
          <Rail.Link href="#installazione">Installazione</Rail.Link>
          <Rail.Link href="#uso">Uso</Rail.Link>
        </Rail.Group>
        <Rail.Group title="Azioni">
          <Rail.Link href="#button" current>
            Button
          </Rail.Link>
          <Rail.Link href="#chip">Chip</Rail.Link>
          <Rail.Link href="#link">Link</Rail.Link>
        </Rail.Group>
      </Rail>
    </Surface>
  ),
} satisfies Meta<typeof Rail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
