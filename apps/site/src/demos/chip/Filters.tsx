import { Chip, Flow } from '@slurp-ui/react';
import { useState } from 'react';

export default function Filters() {
  const [recent, setRecent] = useState(true);
  const [starred, setStarred] = useState(false);
  return (
    <Flow direction="row" gap={2} wrap role="group" aria-label="Filtri">
      <Chip selected={recent} onSelectedChange={setRecent}>
        Recenti
      </Chip>
      <Chip selected={starred} onSelectedChange={setStarred}>
        Preferiti
      </Chip>
      <Chip defaultSelected={false}>Condivisi</Chip>
    </Flow>
  );
}
