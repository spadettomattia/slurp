import { Button, Flow, ToastProvider, useToast } from '@slurp-ui/react';

function Actions() {
  const { toast } = useToast();
  return (
    <Flow direction="row" gap={3} wrap>
      <Button onClick={() => toast({ title: 'Salvato', tone: 'success' })}>Salva</Button>
      <Button
        appearance="soft"
        onClick={() =>
          toast({
            title: 'Elemento archiviato',
            action: { label: 'Annulla', onClick: () => undefined },
          })
        }
      >
        Archivia
      </Button>
    </Flow>
  );
}

export default function Basic() {
  return (
    <ToastProvider>
      <Actions />
    </ToastProvider>
  );
}
