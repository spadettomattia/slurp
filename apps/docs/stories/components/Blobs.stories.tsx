import type { Meta, StoryObj } from '@storybook/react-vite';
import { Blobs, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Blobs',
  component: Blobs,
  tags: ['autodocs'],
  args: { count: 3 },
  render: (args) => (
    <div style={{ position: 'relative', minHeight: 280, overflow: 'hidden', borderRadius: 32 }}>
      <Blobs {...args} />
      <div style={{ position: 'relative', zIndex: 1, padding: 32 }}>
        <Text font="title-l" as="h3">
          Un fondo che respira
        </Text>
      </div>
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Solo decorazione: nascosto alle tecnologie assistive e senza puntatore.',
        'Si muove solo con `transform` e sta fermo con `prefers-reduced-motion`.',
        'Mettilo dietro il contenuto, in un genitore con `position: relative`.',
      ],
    },
  },
} satisfies Meta<typeof Blobs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
