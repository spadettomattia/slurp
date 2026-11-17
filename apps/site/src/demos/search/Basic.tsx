import { Search } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ width: 400 }}>
      <Search aria-label="Archivio" labels={{ placeholder: 'Cerca nell’archivio…' }} />
    </div>
  );
}
