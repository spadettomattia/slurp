import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Placeholder, Surface } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
  args: { shape: 'capsule', width: 240 },
  argTypes: { shape: { control: 'inline-radio', options: ['circle', 'capsule', 'square'] } },
  parameters: {
    slurp: {
      a11y: [
        'Decorativo: nascosto ai lettori di schermo.',
        'Segna la regione che si sta caricando con `aria-busy="true"` (e un nome), e toglilo quando arriva il contenuto.',
        'Con `prefers-reduced-motion` resta fermo, senza pulsare.',
      ],
    },
  },
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scheda: Story = {
  name: 'Scheda in caricamento',
  render: () => (
    <Surface
      as="section"
      css={{ p: 5, maxWidth: 360 }}
      aria-busy="true"
      aria-label="Scheda in caricamento"
    >
      <Flow gap={3}>
        <Flow direction="row" gap={3} align="center">
          <Placeholder shape="circle" />
          <Flow gap={2} css={{ flex: 1 }}>
            <Placeholder width="70%" />
            <Placeholder width="40%" height={12} />
          </Flow>
        </Flow>
        <Placeholder shape="square" width="100%" />
      </Flow>
    </Surface>
  ),
};
