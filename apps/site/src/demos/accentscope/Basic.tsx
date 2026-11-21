import { AccentScope, Button, Chip, Flow, vivid } from '@slurp-ui/react';

export default function Basic() {
  return (
    <AccentScope color={vivid('#e8762d')}>
      <Flow direction="row" gap={3} align="center">
        <Button>Azione</Button>
        <Chip defaultSelected>Selezionato</Chip>
      </Flow>
    </AccentScope>
  );
}
