import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Frame, Text } from '@slurp-ui/react';

const meta = {
  title: 'Fondamenta/Frame',
  component: Frame,
  tags: ['autodocs'],
  render: (args) => (
    <Frame {...args} css={{ py: 6, outline: '1px dashed var(--slurp-line)' }}>
      <Flow gap={2}>
        <Text font="eyebrow">Frame</Text>
        <Text>Colonna centrata: massimo 1280px, margini 24px (16px su telefono).</Text>
      </Flow>
    </Frame>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Solo disposizione. Per la colonna principale della pagina usa `as="main"`: diventa il landmark che i lettori di schermo raggiungono subito.',
        'Sui telefoni il margine scende a 16px ma resta: il testo non tocca mai i bordi dello schermo.',
      ],
    },
  },
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
