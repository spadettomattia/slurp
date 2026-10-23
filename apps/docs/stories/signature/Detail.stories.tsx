import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Fact,
  Flow,
  List,
  ListRow,
  Mark,
  ResultRow,
  Score,
  Search,
  Stage,
  Text,
  useFindInPage,
} from '@slurp-ui/react';
import { useRef, useState } from 'react';

const meta = {
  title: 'Firma/Dettaglio',
  component: Stage,
  tags: ['autodocs'],
  args: { color: '#ef1cac' },
  argTypes: { color: { control: 'color' } },
  render: (args) => (
    <Stage {...args} style={{ maxWidth: 520 }}>
      <Score score={9.1} />
    </Stage>
  ),
} satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StageEScore: Story = { name: 'Stage e Score' };

export const FattiERighe: Story = {
  name: 'Fact e ListRow',
  render: () => (
    <Flow gap={5} css={{ maxWidth: 640 }}>
      <Flow direction="row" gap={3} wrap>
        <Fact label="Prezzo" value="1.239 €" />
        <Fact label="Peso" value="170 g" />
        <Fact label="Garanzia" value="2 anni" />
      </Flow>
      <List>
        <ListRow
          title="Spedizione gratuita"
          meta="Consegna in 24 ore"
          tag="Consigliato"
          highlighted
          value="0 €"
          actionLabel="Dettagli"
        />
        <ListRow
          title="Ritiro in negozio"
          meta="Pronto in 2 ore"
          value="0 €"
          actionLabel="Dettagli"
        />
      </List>
    </Flow>
  ),
};

const TEXT =
  'Pensato per durare: più autonomia, più leggero e con assistenza inclusa per due anni. La batteria si ricarica in meno di un’ora.';

function FindDemo() {
  const [q, setQ] = useState('più');
  const root = useRef<HTMLDivElement>(null);
  const find = useFindInPage(root, q);
  return (
    <Flow gap={4} css={{ maxWidth: 560 }}>
      <Search value={q} onValueChange={setQ} labels={{ label: 'Cerca nella pagina' }} />
      <Text font="caption" muted>
        {find.count
          ? `${find.index + 1}/${find.count} · Invio per la successiva`
          : 'Nessun risultato'}
      </Text>
      <div ref={root} onKeyDown={(e) => e.key === 'Enter' && find.step(1)}>
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
export const CercaNellaPagina: Story = { name: 'Mark e useFindInPage', render: () => <FindDemo /> };

export const Risultati: Story = {
  name: 'ResultRow',
  render: () => (
    <Flow gap={1} css={{ maxWidth: 480 }}>
      <ResultRow title="Lumen Cuffie 1" meta="Audio" value="59 €" />
      <ResultRow title="Orbis Smartphone 2" meta="Smartphone" value="369 €" />
    </Flow>
  ),
};
