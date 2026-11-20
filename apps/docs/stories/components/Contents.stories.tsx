import type { Meta, StoryObj } from '@storybook/react-vite';
import { Contents, Flow, Prose, Surface } from '@slurp-ui/react';

const ITEMS = [
  { id: 'introduzione', label: 'Introduzione' },
  { id: 'uso', label: 'Uso' },
  { id: 'esempi', label: 'Esempi', level: 3 as const },
  { id: 'accessibilita', label: 'Accessibilità' },
];

const meta = {
  title: 'Componenti/Contents',
  component: Contents,
  tags: ['autodocs'],
  args: { items: ITEMS, active: 'uso' },
  parameters: {
    slurp: {
      a11y: [
        'Una `nav` con nome; la sezione letta ha `aria-current="location"` oltre all’evidenziazione.',
        'Senza `active` segue lo scorrimento da sola (`useScrollSpy`).',
      ],
    },
  },
  render: (args) => (
    <Surface level="dock" radius="panel" css={{ p: 3, maxWidth: 260 }}>
      <Contents {...args} />
    </Surface>
  ),
} satisfies Meta<typeof Contents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SegueLoScorrimento: Story = {
  name: 'Segue lo scorrimento',
  args: { active: undefined },
  render: (args) => (
    <Flow direction="row" gap={8} align="start">
      <Prose css={{ flex: 1 }}>
        {ITEMS.map((i) => (
          <section key={i.id}>
            <h2 id={i.id}>{i.label}</h2>
            <p style={{ minHeight: 420 }}>Scorri: l’indice a destra segue la sezione letta.</p>
          </section>
        ))}
      </Prose>
      <Surface level="dock" radius="panel" css={{ p: 3, width: 240, position: 'sticky', top: 16 }}>
        <Contents {...args} />
      </Surface>
    </Flow>
  ),
};
