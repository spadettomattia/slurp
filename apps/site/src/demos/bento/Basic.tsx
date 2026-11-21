import { Bento, Tile } from '@slurp-ui/react';

const sections = [
  { title: 'Per iniziare', subtitle: 'Installazione', color: '#8b6fff', weight: 4 },
  { title: 'Componenti', subtitle: 'Esempi dal vivo', color: '#2f9e8f', weight: 9 },
  { title: 'Personalizzazione', subtitle: 'Tema e variabili', color: '#e0559a', weight: 3 },
  { title: 'API', subtitle: 'Riferimento', color: '#d6805b', weight: 5 },
];

export default function Basic() {
  return (
    <Bento>
      {sections.map((s) => (
        <Tile key={s.title} {...s} />
      ))}
    </Bento>
  );
}
