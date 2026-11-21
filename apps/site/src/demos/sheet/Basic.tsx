import { Button, Chip, Flow, Sheet } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>
        Apri il pannello
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Filtri"
        actions={<Button onClick={() => setOpen(false)}>Mostra i risultati</Button>}
      >
        <Flow direction="row" gap={2} wrap>
          <Chip>Nuovo</Chip>
          <Chip>Usato</Chip>
        </Flow>
      </Sheet>
    </>
  );
}
