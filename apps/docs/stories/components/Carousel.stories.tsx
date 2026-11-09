import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel, Stage, Text } from '@slurp-ui/react';

const views = [
  { label: 'Fronte', color: '#7c5cff' },
  { label: 'Retro', color: '#ef1cac' },
  { label: 'Lato', color: '#00a6a6' },
  { label: 'Dettaglio', color: '#f08c00' },
];

const meta = {
  title: 'Componenti/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: {
    label: 'Foto del prodotto',
    children: views.map((v) => (
      <Stage key={v.label} color={v.color} style={{ height: 320 }}>
        <Text font="title-l">{v.label}</Text>
      </Stage>
    )),
  },
  argTypes: { children: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Carousel {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Una regione con `aria-roledescription="carousel"` e un nome; ogni slide è un gruppo “2 di 4”. Solo quella mostrata è raggiungibile (le altre sono `inert`) ed è annunciata con garbo.',
        'Non si muove mai da solo. Sul telefono si scorre col dito (scroll-snap); con il focus sulla striscia, frecce, Home e Fine cambiano slide.',
        'Precedente e successiva sono bottoni con nome; il pallino corrente è una pillola più lunga (forma, non solo colore) con `aria-current`. Oltre `maxDots` slide diventa un contatore “2 / 12”.',
      ],
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Many slides: a counter instead of the dots. */
export const Many: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Stage key={i} style={{ height: 320 }}>
        <Text font="title-l">Foto {i + 1}</Text>
      </Stage>
    )),
  },
};
