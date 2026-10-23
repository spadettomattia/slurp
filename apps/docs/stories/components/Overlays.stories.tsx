import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bloom,
  Button,
  Chip,
  Dialog,
  Flow,
  Menu,
  MenuItem,
  Sheet,
  Text,
  ToastProvider,
  useToast,
} from '@slurp-ui/react';
import { CloseIcon, FiltersIcon, GearIcon } from '@slurp-ui/react/icons';
import { useState } from 'react';

const meta = {
  title: 'Componenti/Bloom e pannelli',
  component: Bloom,
  tags: ['autodocs'],
  args: { trigger: 'Filtri', panelLabel: 'Filtri', width: 320, placement: 'bottom-start' },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
  },
  render: (args) => (
    <div style={{ minHeight: 320 }}>
      <Bloom {...args}>
        <Text font="eyebrow" css={{ px: 2 }}>
          Condizione
        </Text>
        <Flow direction="row" gap={2} wrap css={{ p: 2 }}>
          {['Nuovo', 'Usato', 'Ricondizionato'].map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </Flow>
      </Bloom>
    </div>
  ),
} satisfies Meta<typeof Bloom>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The button becomes the panel: one surface grows (width, height, radius) and shrinks back into the trigger. */
export const Playground: Story = {};

export const DaUnBubble: Story = {
  name: 'Da un bottone tondo',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 320 }}>
      <Bloom
        trigger={<GearIcon />}
        openTrigger={<CloseIcon />}
        label="Impostazioni"
        closeLabel="Chiudi impostazioni"
        placement="bottom-end"
        panelLabel="Impostazioni"
      >
        <Text font="title-s" css={{ px: 2, display: 'flex', alignItems: 'center' }}>
          Impostazioni
        </Text>
        <Flow gap={1} css={{ p: 2 }}>
          <Chip>Tema scuro</Chip>
        </Flow>
      </Bloom>
    </div>
  ),
};

export const MenuAzioni: Story = {
  name: 'Menu',
  render: () => (
    <div style={{ minHeight: 280 }}>
      <Menu
        trigger={
          <>
            <FiltersIcon /> Azioni
          </>
        }
      >
        <MenuItem>Modifica</MenuItem>
        <MenuItem>Duplica</MenuItem>
        <MenuItem disabled>Archivia</MenuItem>
        <MenuItem tone="danger">Elimina</MenuItem>
      </Menu>
    </div>
  ),
};

function DialogDemo({ sheet = false }: { sheet?: boolean }) {
  const [open, setOpen] = useState(false);
  const Component = sheet ? Sheet : Dialog;
  return (
    <>
      <Button appearance="outline" tone="neutral" onClick={() => setOpen(true)}>
        {sheet ? 'Apri il pannello' : 'Svuota il carrello'}
      </Button>
      <Component
        open={open}
        onOpenChange={setOpen}
        title={sheet ? 'Filtri' : 'Svuotare il carrello?'}
        description={sheet ? undefined : 'I 3 prodotti verranno rimossi.'}
        actions={
          <>
            <Button appearance="plain" tone="neutral" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button onClick={() => setOpen(false)}>
              {sheet ? 'Mostra 24 risultati' : 'Svuota'}
            </Button>
          </>
        }
      >
        {sheet ? (
          <Flow direction="row" gap={2} wrap>
            {['Nuovo', 'Usato', 'Sotto i 500 €'].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </Flow>
        ) : null}
      </Component>
    </>
  );
}

export const Dialoghi: Story = {
  name: 'Dialog e Sheet',
  render: () => (
    <Flow direction="row" gap={3} wrap>
      <DialogDemo />
      <DialogDemo sheet />
    </Flow>
  ),
};

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

export const Toast: Story = {
  render: () => (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  ),
};
