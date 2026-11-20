import { PageNav } from '@slurp-ui/react';

export default function Basic() {
  return (
    <PageNav
      css={{ width: '100%' }}
      labels={{ label: 'Guida: pagina precedente e successiva' }}
      previous={{ title: 'Installazione', href: '#installazione' }}
      next={{ title: 'Primi passi', href: '#primi-passi' }}
    />
  );
}
