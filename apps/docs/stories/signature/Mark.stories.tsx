import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Mark, Search, Text, useFindInPage } from '@slurp-ui/react';
import { useRef, useState } from 'react';

const TEXT =
  'Pensato per durare: più autonomia, più leggero e con assistenza inclusa per due anni. La batteria si ricarica in meno di un’ora.';

const meta = {
  title: 'Firma/Mark',
  component: Mark,
  tags: ['autodocs'],
  args: { text: TEXT, query: 'più' },
  render: (args) => (
    <Text font="body-l" css={{ maxWidth: 560 }}>
      <Mark {...args} />
    </Text>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Le corrispondenze sono `<mark>`: evidenziate con tinta **e** sottolineatura, non solo il colore.',
        'Ignora maiuscole e accenti (“piu” trova “più”). La corrispondenza attiva di `useFindInPage` è piena e portata a metà schermo.',
        'Il conteggio (“2 di 5”) va annunciato a parte: lo fa `Dock.Search` con il suo contatore.',
      ],
    },
  },
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function FindDemo() {
  const [q, setQ] = useState('più');
  const root = useRef<HTMLDivElement>(null);
  const find = useFindInPage(root, q);
  return (
    <Flow gap={4} css={{ maxWidth: 560 }}>
      <Search value={q} onValueChange={setQ} labels={{ label: 'Cerca nella pagina' }} />
      <Text font="caption" muted role="status">
        {find.count ? `${find.index + 1} di ${find.count}` : 'Nessun risultato'}
      </Text>
      <div ref={root}>
        <Text font="body-l">
          <Mark text={TEXT} query={q} />
        </Text>
      </div>
      <button type="button" onClick={() => find.step(1)} style={{ alignSelf: 'start' }}>
        Prossima corrispondenza
      </button>
    </Flow>
  );
}

/** Mark + useFindInPage: matches ignore case and accents; the active one is filled and scrolled to the middle. */
export const CercaNellaPagina: Story = { name: 'Con useFindInPage', render: () => <FindDemo /> };
