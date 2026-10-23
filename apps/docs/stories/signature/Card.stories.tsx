import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    href: '#prodotto',
    title: 'Lumen Cuffie 1',
    description: 'Lumen',
    value: '59 €',
    valuePrefix: 'da',
    badge: 'Usato',
    color: '#ef1cac',
  },
  argTypes: { color: { control: 'color' } },
  render: (args) => (
    <div style={{ width: 260 }}>
      <Card {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Con `href` è un link, con `onClick` un bottone, senza nessuno dei due un semplice contenitore.',
        'Il nome è il contenuto testuale (titolo, descrizione, valore): tienilo breve e senza frasi come “scopri di più”.',
        'Il media è decorativo; le pillole del testo non lo coprono mai.',
      ],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
