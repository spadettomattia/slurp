import { Bloom, Chip, Flow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Bloom trigger="Filtri" panelLabel="Filtri" width={300}>
      <Flow direction="row" gap={2} wrap>
        <Chip>Nuovo</Chip>
        <Chip>Usato</Chip>
        <Chip>Sotto i 500 €</Chip>
      </Flow>
    </Bloom>
  );
}
