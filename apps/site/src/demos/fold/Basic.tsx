import { Fold } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div>
      <Fold summary="Come installo la libreria?" headingLevel={3} defaultOpen>
        Aggiungi il pacchetto, importa il foglio di stile e avvolgi l’app nel provider.
      </Fold>
      <Fold summary="Posso cambiare i colori?" headingLevel={3}>
        Sì: il tema genera i token da pochi valori.
      </Fold>
    </div>
  );
}
