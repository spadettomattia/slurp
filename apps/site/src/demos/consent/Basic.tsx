import { Button, Consent, Link } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>
        Mostra il banner
      </Button>
      <Consent
        open={open}
        title="Preferenze sui cookie"
        onAccept={() => setOpen(false)}
        onReject={() => setOpen(false)}
        onCustomize={() => setOpen(false)}
      >
        Usiamo cookie tecnici e, con il tuo consenso, di misura.{' '}
        <Link href="#privacy">Informativa</Link>
      </Consent>
    </>
  );
}
