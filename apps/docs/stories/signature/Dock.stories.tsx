import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, Dock, Filters, Settings, Text } from '@slurp-ui/react';
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
  title: 'Firma/Dock e impostazioni',
  component: Dock,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <DockDemo />,
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One place to navigate: back, the path, the scoped search ("2/5" in a page), actions; panels grow above. */
export const Navigazione: Story = {};

export const Impostazioni: Story = {
  render: () => (
    <div style={{ minHeight: 420 }}>
      <Settings
        inline
        languages={[
          { value: 'it', label: 'Italiano', lang: 'it' },
          { value: 'en', label: 'English', lang: 'en' },
        ]}
        language="it"
      >
        <Text font="caption" muted>
          Le schede prodotto restano in italiano.
        </Text>
      </Settings>
    </div>
  ),
};
