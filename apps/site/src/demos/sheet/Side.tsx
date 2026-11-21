import { Button, Sheet } from '@slurp-ui/react';
import { useState } from 'react';

export default function Side() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>
        Apri il pannello laterale
      </Button>
      <Sheet
        side="end"
        open={open}
        onOpenChange={setOpen}
        title="Dettagli"
        description="Scorre dal bordo di fine."
      >
        Contenuto del pannello.
      </Sheet>
    </>
  );
}
