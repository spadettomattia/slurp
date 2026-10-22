import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Flow, Frame, Text } from '@slurp/ui';

const meta = {
  title: 'Fondamenta/Flow',
  component: Flow,
  tags: ['autodocs'],
  args: { direction: 'row', gap: 4, wrap: true },
  argTypes: {
    direction: { control: 'inline-radio', options: ['column', 'row'] },
    gap: { control: 'select', options: [1, 2, 3, 4, 5, 6, 8, 10] },
    align: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end', 'stretch'] },
    justify: {
      control: 'inline-radio',
      options: [undefined, 'start', 'center', 'end', 'space-between'],
    },
  },
  render: (args) => (
    <Flow {...args}>
      {['Uno', 'Due', 'Tre', 'Quattro'].map((label) => (
        <div key={label} className="docs-box">
          {label}
        </div>
      ))}
    </Flow>
  ),
} satisfies Meta<typeof Flow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Responsive: Story = {
  name: 'Colonna su telefono, riga sopra',
  args: { direction: { base: 'row', compact: 'column' }, gap: { base: 6, compact: 3 } },
};

export const FrameECell: Story = {
  name: 'Frame e Cell',
  render: () => (
    <Frame css={{ py: 6 }}>
      <Flow gap={3}>
        <Text font="eyebrow">Frame</Text>
        <Text>Colonna centrata: massimo 1280px, margini 24px (16px su telefono).</Text>
        <Cell
          as="section"
          aria-label="Esempio di Cell"
          css={{ p: 5, radius: 'md', bg: 'accent-soft', '&:hover': { bg: 'surface-2' } }}
        >
          <Text font="label">
            Cell con css: p 5, radius md, sfondo accent-soft, hover surface-2
          </Text>
        </Cell>
      </Flow>
    </Frame>
  ),
};
