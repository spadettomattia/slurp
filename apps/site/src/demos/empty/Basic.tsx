import { Button, Empty } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Empty
      title="Nessun risultato"
      description="Prova con meno filtri o un’altra ricerca."
      action={<Button>Azzera filtri</Button>}
    />
  );
}
