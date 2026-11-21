import { Chip, Filters, Surface } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [used, setUsed] = useState(true);
  const [cheap, setCheap] = useState(false);
  return (
    <Surface css={{ p: 4, maxWidth: 360 }}>
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
    </Surface>
  );
}
