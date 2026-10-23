import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog } from '@slurp-ui/react';
import { useState } from 'react';

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>
        Svuota il carrello
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Svuotare il carrello?"
        description="I 3 prodotti verranno rimossi."
        actions={
          <>
            <Button appearance="plain" tone="neutral" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button onClick={() => setOpen(false)}>Svuota</Button>
          </>
        }
      />
    </>
  );
}

const meta = {
  title: 'Componenti/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { title: 'Svuotare il carrello?' },
  render: () => <DialogDemo />,
  parameters: {
    slurp: {
      a11y: [
        'Un `<dialog>` nativo modale: sta nel top layer, il resto della pagina è inerte e il focus resta dentro.',
        'Il titolo è il nome (`aria-labelledby`), la descrizione è collegata con `aria-describedby`.',
        'Escape, il bottone di chiusura (`labels.close`) e, con `dismissible`, un clic sullo sfondo lo chiudono; il focus torna a chi l’ha aperto.',
        'Cresce dal controllo che l’ha aperto; con `prefers-reduced-motion` compare e basta.',
      ],
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
