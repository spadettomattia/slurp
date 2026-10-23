import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tile } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Tile',
  component: Tile,
  tags: ['autodocs'],
  args: { title: 'Smartphone', subtitle: '128 modelli', color: '#8b6fff', badge: 'Novità' },
  argTypes: {
    color: { control: 'color' },
    size: { control: 'inline-radio', options: ['large', 'small'] },
  },
  render: (args) => (
    <div style={{ width: 320, height: 220 }}>
      <Tile {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Un `<button>`: il nome è il titolo con sottotitolo e badge. Con `as` (un link del router) diventa un link.',
        'Il colore della sezione tinge lo sfondo, mentre il testo usa `fg` e `muted` del tema. Con colori molto scuri o molto saturi controlla il contrasto.',
        'La bolla che si muove usa solo `transform` e si ferma con `prefers-reduced-motion`; illustrazioni e media sono decorativi.',
      ],
    },
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
