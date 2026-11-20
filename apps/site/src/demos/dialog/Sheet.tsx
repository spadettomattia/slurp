import { Button, Sheet, Switch, Flow } from '@slurp-ui/react';
import { useState } from 'react';

export default function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="soft" onClick={() => setOpen(true)}>
        Preferenze
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Preferenze"
        actions={<Button onClick={() => setOpen(false)}>Fatto</Button>}
      >
        <Flow gap={3}>
          <Switch defaultChecked>Notifiche</Switch>
          <Switch>Riepilogo settimanale</Switch>
        </Flow>
      </Sheet>
    </>
  );
}
