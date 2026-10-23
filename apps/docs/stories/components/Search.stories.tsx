import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Search, Text } from '@slurp-ui/react';
import { useState } from 'react';

const meta = {
  title: 'Componenti/Search',
  component: Search,
  tags: ['autodocs'],
  args: { labels: { placeholder: 'Cerca in Smartphone…' } },
  parameters: {
    slurp: {
      a11y: [
        'Sta in un landmark `search`; il campo ha un nome nascosto (`labels.label`, “Cerca”) oltre al placeholder che dice dove cerca.',
        '`count` compare in fondo al campo ed è annunciato in modo educato mentre si scrive (`labels.results`).',
        'Il bottone per svuotare ha un nome (`labels.clear`) e riporta il focus nel campo; Invio chiama `onSearch`.',
      ],
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const ITEMS = ['iPhone 16', 'Pixel 9', 'Galaxy S25', 'Xperia 1'];

function CountDemo() {
  const [q, setQ] = useState('');
  const found = ITEMS.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
  return (
    <Flow gap={3} css={{ maxWidth: 420 }}>
      <Search
        value={q}
        onValueChange={setQ}
        count={found.length}
        labels={{ placeholder: 'Cerca in Smartphone…' }}
      />
      <Text font="caption" muted>
        {found.join(', ') || 'Nessun risultato'}
      </Text>
    </Flow>
  );
}

export const ConConteggio: Story = { name: 'Con il conteggio', render: () => <CountDemo /> };
