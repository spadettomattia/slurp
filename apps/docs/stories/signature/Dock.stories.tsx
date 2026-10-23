import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, Dock, Filters } from '@slurp-ui/react';
import { FiltersIcon } from '@slurp-ui/react/icons';
import { useState } from 'react';

function DockDemo() {
  const [panel, setPanel] = useState(false);
  const [used, setUsed] = useState(false);
  const [cheap, setCheap] = useState(false);
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const count = q.trim() ? 4 : undefined;
  return (
    <div style={{ minHeight: 420, display: 'flex', alignItems: 'flex-end' }}>
      <Dock
        inline
        panel={
          panel ? (
            <Filters
              onReset={() => (setUsed(false), setCheap(false))}
              active={Number(used) + Number(cheap)}
            >
              <Filters.Group label="Condizione">
                <Chip selected={used} onSelectedChange={setUsed}>
                  Solo usato
                </Chip>
              </Filters.Group>
              <Filters.Group label="Prezzo">
                <Chip selected={cheap} onSelectedChange={setCheap}>
                  Sotto i 500 €
                </Chip>
              </Filters.Group>
            </Filters>
          ) : null
        }
        panelLabel="Filtri"
        onDismiss={() => setPanel(false)}
        style={{ width: '100%' }}
      >
        <Dock.Crumbs>
          <Dock.Back />
          <Dock.Crumb>Audio</Dock.Crumb>
          <Dock.Crumb current>Lumen Cuffie 1</Dock.Crumb>
        </Dock.Crumbs>
        <Dock.Search
          value={q}
          onValueChange={setQ}
          placeholder="Cerca in Lumen Cuffie 1…"
          count={count}
          index={index}
          onStep={(d) => setIndex((i) => (i + d + 4) % 4)}
        />
        <Dock.Actions>
          <Dock.Action
            label="Filtri"
            count={Number(used) + Number(cheap)}
            expanded={panel}
            onClick={() => setPanel(!panel)}
          >
            <FiltersIcon />
          </Dock.Action>
        </Dock.Actions>
      </Dock>
    </div>
  );
}

const meta = {
  title: 'Firma/Dock',
  component: Dock,
  subcomponents: {
    'Dock.Crumbs': Dock.Crumbs,
    'Dock.Back': Dock.Back,
    'Dock.Crumb': Dock.Crumb,
    'Dock.Search': Dock.Search,
    'Dock.Actions': Dock.Actions,
    'Dock.Action': Dock.Action,
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    slurp: {
      a11y: [
        'Un landmark `nav` con nome (`labels.navigation`); le briciole sono una lista con nome e la pagina corrente ha `aria-current="page"`.',
        'Indietro e le azioni di sola icona hanno un nome; il conteggio di un’azione entra nel nome (“Filtri” più “2 attivi”) e `expanded` dà `aria-expanded`.',
        'Il pannello cresce sopra la barra come regione con nome (`panelLabel`); un clic fuori, Escape o Tab in uscita chiamano `onDismiss` e il focus torna al controllo che l’ha aperto.',
        'Trova nella pagina: il contatore “2/5” è un bottone con nome (“Vai alla prossima corrispondenza: 2 di 5”), Invio / Maiusc+Invio scorrono, il risultato è annunciato con garbo. Dalla ricerca, Freccia giù entra nei risultati.',
        'Sui telefoni le briciole precedenti diventano icone (il nome resta quello testuale) e la ricerca diventa un’azione.',
      ],
    },
  },
  render: () => <DockDemo />,
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One place to navigate: back, the path, the scoped search ("2/5" in a page), actions; panels grow above. */
export const Playground: Story = {};
