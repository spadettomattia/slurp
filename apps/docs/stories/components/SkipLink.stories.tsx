import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  args: { href: '#contenuto' },
  parameters: {
    slurp: {
      a11y: [
        'È il primo elemento raggiungibile con Tab: compare solo con il focus da tastiera.',
        'Il bersaglio ha un id e `tabIndex={-1}`, così il focus ci arriva davvero.',
      ],
    },
  },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <Text>Premi Tab per vedere il link, poi Invio.</Text>
      <main id="contenuto" tabIndex={-1}>
        <Text font="title-l">Contenuto</Text>
      </main>
    </>
  ),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
