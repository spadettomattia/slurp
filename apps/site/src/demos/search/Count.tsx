import { Flow, Search, Text, matchesAll } from '@slurp-ui/react';
import { useState } from 'react';

const COLORS = [
  'Blu notte',
  'Blu cielo',
  'Verde salvia',
  'Rosso corallo',
  'Giallo sabbia',
  'Viola lavanda',
];

export default function Count() {
  const [query, setQuery] = useState('');
  const found = COLORS.filter((c) => matchesAll(c, query));
  return (
    <Flow gap={4} style={{ width: 400 }}>
      <Search
        aria-label="Colori"
        value={query}
        onValueChange={setQuery}
        count={found.length}
        labels={{ placeholder: 'Cerca un colore…' }}
      />
      <Text font="body-s">{found.join(' · ') || '—'}</Text>
    </Flow>
  );
}
