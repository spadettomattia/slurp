import { Button, Flow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow direction="row" gap={3} wrap align="center">
      <Button>Salva</Button>
      <Button appearance="soft">Annulla</Button>
      <Button appearance="plain">Altro</Button>
    </Flow>
  );
}
