import { List, ListRow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ maxWidth: 640 }}>
      <List>
        <ListRow
          title="Spedizione gratuita"
          meta="Consegna in 24 ore"
          tag="Consigliato"
          highlighted
          value="0 €"
          actionLabel="Dettagli"
          href="#spedizione"
        />
        <ListRow
          title="Ritiro in negozio"
          meta="Pronto in 2 ore"
          value="0 €"
          actionLabel="Dettagli"
          href="#ritiro"
        />
      </List>
    </div>
  );
}
