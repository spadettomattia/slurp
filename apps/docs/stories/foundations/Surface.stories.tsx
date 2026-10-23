import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Surface, Text } from '@slurp-ui/react';

const meta = {
  title: 'Fondamenta/Surface',
  component: Surface,
  tags: ['autodocs'],
  args: { level: 'surface', radius: 'card' },
  argTypes: {
    level: { control: 'inline-radio', options: ['surface', 'dock', 'solid'] },
    radius: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'card', 'panel', 'full'] },
  },
  render: (args) => (
    <div className="docs-backdrop">
      <Surface {...args} css={{ p: 6, maxWidth: 420 }}>
        <Flow gap={1}>
          <Text font="title-s">Superficie fluttuante</Text>
          <Text muted>Il testo si appoggia al contrasto di fg e muted, non al bordo.</Text>
        </Flow>
      </Surface>
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Solo aspetto: nessun ruolo. Se la superficie è una regione con un significato, dalle un elemento (`as="section"`) e un nome.',
        'Il testo sopra usa `fg` e `muted`: il contrasto viene dai colori del testo, non dal bordo della superficie.',
      ],
    },
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Livelli: Story = {
  render: () => (
    <div className="docs-backdrop">
      <Flow direction={{ base: 'row', compact: 'column' }} gap={5}>
        {(['surface', 'dock', 'solid'] as const).map((level) => (
          <Surface key={level} level={level} css={{ p: 6, flex: 1 }}>
            <Text font="title-s">{level}</Text>
            <Text font="caption">
              {level === 'surface'
                ? 'Traslucida'
                : level === 'dock'
                  ? 'Quasi opaca'
                  : 'Opaca, senza sfocatura'}
            </Text>
          </Surface>
        ))}
      </Flow>
    </div>
  ),
};
