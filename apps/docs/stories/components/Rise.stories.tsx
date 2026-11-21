import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Rise, Surface, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Rise',
  component: Rise,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    slurp: {
      a11y: [
        'Il contenuto è nel DOM e leggibile da subito: la rivelazione cambia solo opacità e posizione.',
        'Con `prefers-reduced-motion` niente movimento, solo una dissolvenza; senza script il contenuto è semplicemente visibile.',
        'Non avvolgere l’hero (ha la sua entrata) né ciò che compare di continuo.',
      ],
    },
  },
  render: () => (
    <div>
      <div style={{ height: '60vh' }}>Scorri</div>
      <Flow gap={4}>
        {[0, 1, 2].map((i) => (
          <Rise key={i} delay={i * 60}>
            <Surface style={{ padding: 24 }}>
              <Text font="title-s">Elemento {i + 1}</Text>
              <Text muted>Sale di 32px e appare, una volta sola.</Text>
            </Surface>
          </Rise>
        ))}
      </Flow>
      <div style={{ height: '60vh' }} />
    </div>
  ),
} satisfies Meta<typeof Rise>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
