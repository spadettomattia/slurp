import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bento, Card, Empty, Button, Shelf, Tile } from '@slurp-ui/react';

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
  title: 'Firma/Griglia e liste',
  component: Tile,
  tags: ['autodocs'],
  args: { title: 'Smartphone', subtitle: '128 modelli', color: '#8b6fff', badge: 'Novità' },
  argTypes: { color: { control: 'color' } },
  render: (args) => (
    <div style={{ width: 320, height: 220 }}>
      <Tile {...args} />
    </div>
  ),
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TilePlayground: Story = { name: 'Tile' };

/** `layout="auto"`: spans from bentoLayout(), the first section tall on the left; two columns below 860px. */
export const BentoAuto: Story = {
  name: 'Bento',
  render: () => (
    <Bento>
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
};

export const ShelfDiCard: Story = {
  name: 'Shelf di Card',
  render: () => (
    <Shelf>
      {['Lumen', 'Orbis', 'Nadir', 'Vela'].map((brand, i) => (
        <Card
          key={brand}
          href="#prodotto"
          title={`${brand} Cuffie ${i + 1}`}
          description={brand}
          value={`${59 + i * 70} €`}
          valuePrefix="da"
          badge={i === 2 ? 'Usato' : undefined}
          color="#ef1cac"
        />
      ))}
    </Shelf>
  ),
};

export const Vuoto: Story = {
  name: 'Empty',
  render: () => (
    <Empty
      title="Nessun risultato"
      description="Prova con meno filtri o un’altra ricerca."
      action={<Button>Azzera filtri</Button>}
    />
  ),
};
