import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccentScope, Cell, Flow, Surface, Text, vivid } from '@slurp/ui';
import { hue } from '@slurp/ui/tokens';

function Sample({ label }: { label: string }) {
  return (
    <Surface css={{ p: 5 }}>
      <Flow gap={3}>
        <Text font="title-s">{label}</Text>
        <Cell
          css={{
            bg: 'accent',
            color: 'on-accent',
            p: 3,
            radius: 'full',
            font: 'label',
            textAlign: 'center',
          }}
        >
          Riempimento accent
        </Cell>
        <Cell css={{ bg: 'accent-soft', p: 3, radius: 'md' }}>Riga evidenziata (accent-soft)</Cell>
        <Text tone="accent" font="label">
          Testo accent-ink
        </Text>
      </Flow>
    </Surface>
  );
}

const meta = {
  title: 'Fondamenta/AccentScope',
  component: AccentScope,
  tags: ['autodocs'],
  args: { color: 'hue-teal' },
  argTypes: { color: { control: 'color' } },
  render: (args) => (
    <AccentScope {...args}>
      <Sample label={args.color} />
    </AccentScope>
  ),
} satisfies Meta<typeof AccentScope>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Preset: Story = {
  name: 'Tutte le tinte',
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      }}
    >
      {Object.keys(hue).map((name) => (
        <AccentScope key={name} color={`hue-${name}`}>
          <Sample label={`hue-${name}`} />
        </AccentScope>
      ))}
    </div>
  ),
};

export const ColoreDalContenuto: Story = {
  name: 'Colore dal contenuto (vivid)',
  render: () => (
    <Flow direction={{ base: 'row', compact: 'column' }} gap={5}>
      {['#336699', '#7a5c00', '#c0c0c0'].map((source) => (
        <AccentScope key={source} color={source} css={{ flex: 1 }}>
          <Sample label={`${source} → ${vivid(source)}`} />
        </AccentScope>
      ))}
    </Flow>
  ),
};
