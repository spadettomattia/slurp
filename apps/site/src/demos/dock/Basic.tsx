import { Chip, Dock, Filters } from '@slurp-ui/react';
import { FiltersIcon } from '@slurp-ui/react/icons';
import { useState } from 'react';

export default function Basic() {
  const [panel, setPanel] = useState(false);
  const [used, setUsed] = useState(false);
  const [q, setQ] = useState('');
  return (
    <div style={{ minHeight: 320, display: 'flex', alignItems: 'flex-end' }}>
      <Dock
        inline
        panelLabel="Filtri"
        onDismiss={() => setPanel(false)}
        style={{ width: '100%' }}
        panel={
          panel ? (
            <Filters onReset={() => setUsed(false)} active={Number(used)}>
              <Filters.Group label="Condizione">
                <Chip selected={used} onSelectedChange={setUsed}>
                  Solo usato
                </Chip>
              </Filters.Group>
            </Filters>
          ) : null
        }
      >
        <Dock.Crumbs>
          <Dock.Back />
          <Dock.Crumb>Audio</Dock.Crumb>
          <Dock.Crumb current>Cuffie senza fili</Dock.Crumb>
        </Dock.Crumbs>
        <Dock.Search value={q} onValueChange={setQ} placeholder="Cerca nella pagina…" />
        <Dock.Actions>
          <Dock.Action
            label="Filtri"
            count={Number(used)}
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
