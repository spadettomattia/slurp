import { Button, Dialog } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>
        Elimina la bozza
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Eliminare la bozza?"
        description="Non si potrà recuperare."
        actions={
          <>
            <Button appearance="plain" tone="neutral" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button onClick={() => setOpen(false)}>Elimina</Button>
          </>
        }
      />
    </>
  );
}
