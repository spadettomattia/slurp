import type { Meta, StoryObj } from '@storybook/react-vite';
import { Score, Stage } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Stage',
  component: Stage,
  tags: ['autodocs'],
  args: { color: '#ef1cac' },
  argTypes: { color: { control: 'color' } },
  render: (args) => (
    <Stage {...args} style={{ maxWidth: 520 }}>
      <Score score={9.1} />
    </Stage>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Solo fondale: alone e anello sono decorativi e nascosti ai lettori di schermo; il contenuto (foto, Score) porta il significato.',
        'L’alone respira lentamente e si ferma con `prefers-reduced-motion`.',
      ],
    },
  },
} satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
