import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bento, Tile } from '@slurp-ui/react';

const SECTIONS = [
  { id: 'phones', title: 'Smartphone', color: '#8b6fff', weight: 9, subtitle: '128 modelli' },
  { id: 'laptops', title: 'Laptop', color: '#3d7bf7', weight: 6 },
  { id: 'audio', title: 'Audio', color: '#ef1cac', weight: 7, badge: 'Novità' },
  { id: 'home', title: 'Casa', color: '#16a34a', weight: 5 },
  { id: 'games', title: 'Giochi', color: '#f97316', weight: 4 },
  { id: 'photo', title: 'Foto', color: '#14b8a6', weight: 6 },
  { id: 'sport', title: 'Sport', color: '#e29b03', weight: 3 },
];

const meta = {
  title: 'Firma/Bento',
  component: Bento,
  tags: ['autodocs'],
  args: { layout: 'auto' },
  argTypes: { layout: { control: 'inline-radio', options: ['auto', 'manual'] } },
  render: (args) => (
    <Bento {...args}>
      {SECTIONS.map((s) => (
        <Tile
          key={s.id}
          title={s.title}
          subtitle={s.subtitle}
          badge={s.badge}
          color={s.color}
          weight={s.weight}
        />
      ))}
    </Bento>
  ),
  parameters: {
    slurp: {
      a11y: [
        'La griglia cambia solo la disposizione: l’ordine di lettura e di Tab resta quello dei figli, cioè l’ordine di priorità.',
        'Sotto 860px passa a due colonne; le tile restano bersagli grandi.',
      ],
    },
  },
} satisfies Meta<typeof Bento>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `layout="auto"`: spans from bentoLayout(), the first section tall on the left; two columns below 860px. */
export const Playground: Story = {};
