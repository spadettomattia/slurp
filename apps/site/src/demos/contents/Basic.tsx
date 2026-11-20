import { Contents, Surface } from '@slurp-ui/react';

const items = [
  { id: 'introduzione', label: 'Introduzione' },
  { id: 'uso', label: 'Uso' },
  { id: 'esempi', label: 'Esempi', level: 3 as const },
  { id: 'accessibilita', label: 'Accessibilità' },
];

export default function Basic() {
  return (
    <Surface level="dock" radius="panel" css={{ p: 3, width: 260 }}>
      <Contents items={items} active="uso" labels={{ title: 'Indice dell’articolo' }} />
    </Surface>
  );
}
