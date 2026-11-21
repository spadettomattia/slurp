import { Flow, Notice } from '@slurp-ui/react';

export default function Tones() {
  return (
    <Flow gap={3}>
      <Notice tone="neutral" title="Aggiornamento disponibile">
        Riavvia per applicarlo.
      </Notice>
      <Notice tone="success" title="Salvato">
        Lo ritrovi nella tua lista.
      </Notice>
      <Notice tone="warning" title="Quasi pieno">
        Restano 2 posti.
      </Notice>
      <Notice tone="danger" title="Invio non riuscito">
        Controlla la connessione e riprova.
      </Notice>
    </Flow>
  );
}
