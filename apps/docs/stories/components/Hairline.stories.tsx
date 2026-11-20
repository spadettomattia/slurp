import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Hairline, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Hairline',
  component: Hairline,
  tags: ['autodocs'],
  args: {},
  parameters: {
    slurp: {
      a11y: [
        'Decorativa di default: nascosta alle tecnologie assistive, perché separa solo visivamente.',
        'Con `decorative={false}` diventa un separatore annunciato (`<hr>`), anche verticale con `aria-orientation`.',
      ],
    },
  },
  render: (args) => (
    <Flow gap={4} css={{ maxWidth: 420 }}>
      <Text>Primo gruppo</Text>
      <Hairline {...args} />
      <Text>Secondo gruppo</Text>
    </Flow>
  ),
} satisfies Meta<typeof Hairline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Verticale: Story = {
  render: () => (
    <Flow direction="row" gap={4} align="center">
      <Text>Recenti</Text>
      <Hairline orientation="vertical" />
      <Text>Preferiti</Text>
    </Flow>
  ),
};
