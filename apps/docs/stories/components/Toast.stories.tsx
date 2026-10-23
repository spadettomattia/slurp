import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Flow, ToastProvider, useToast } from '@slurp-ui/react';

function ToastButtons() {
  const { toast } = useToast();
  return (
    <Flow direction="row" gap={3} wrap>
      <Button
        onClick={() =>
          toast({
            title: 'Aggiunto al carrello',
            tone: 'success',
            action: { label: 'Annulla', onClick: () => undefined },
          })
        }
      >
        Aggiungi
      </Button>
      <Button
        appearance="outline"
        tone="neutral"
        onClick={() =>
          toast({
            title: 'Connessione lenta',
            description: 'Le immagini arrivano dopo.',
            tone: 'warning',
          })
        }
      >
        Avviso
      </Button>
    </Flow>
  );
}

const meta = {
  title: 'Componenti/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  render: (args) => (
    <ToastProvider {...args}>
      <ToastButtons />
    </ToastProvider>
  ),
  parameters: {
    slurp: {
      a11y: [
        'La lista è una regione live educata, presente fin dall’inizio: ogni nuovo toast viene annunciato.',
        'Il tono è un’icona più il testo; ogni toast ha un bottone di chiusura con nome (`labels.dismiss`).',
        'Il tempo (`duration`, 5 s) si ferma mentre il toast ha il puntatore o il focus; per contenuti da non perdere usa `Infinity` o un `Notice`.',
      ],
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `useToast().toast(options)` from anywhere under the provider. */
export const Playground: Story = {};
