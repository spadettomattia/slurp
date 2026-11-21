import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  args: {
    latestFirst: true,
    items: [
      { title: 'Consegnato', time: '12 marzo 2026', dateTime: '2026-03-12' },
      {
        title: 'In consegna',
        time: '11 marzo 2026',
        dateTime: '2026-03-11',
        description: 'Il corriere ha preso in carico il pacco.',
      },
      { title: 'Preparato', time: '10 marzo 2026', dateTime: '2026-03-10' },
    ],
  },
  parameters: {
    slurp: {
      a11y: [
        'Una lista ordinata (`<ol>`): l’ordine è nel contenuto, non solo nella linea.',
        'Con `dateTime` la data diventa un `<time>` leggibile dalle macchine; i marcatori sono decorativi.',
      ],
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
