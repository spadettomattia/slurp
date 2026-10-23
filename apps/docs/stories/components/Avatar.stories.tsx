import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Flow, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Ada Lovelace', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    slurp: {
      a11y: [
        '`name` è il testo alternativo della foto e la fonte delle iniziali.',
        'Accanto a un nome già visibile usa `decorative`: l’avatar viene nascosto ai lettori di schermo per non ripetere il nome.',
      ],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Taglie: Story = {
  render: () => (
    <Flow direction="row" gap={4} align="center">
      <Avatar name="Grace Hopper" size="sm" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Grace Hopper" size="lg" />
    </Flow>
  ),
};

export const ConNome: Story = {
  name: 'Accanto al nome',
  render: () => (
    <Flow direction="row" gap={3} align="center">
      <Avatar name="Alan Turing" decorative />
      <Text font="label">Alan Turing</Text>
    </Flow>
  ),
};
