import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Chip, Flow, Sheet } from '@slurp-ui/react';
import { useState } from 'react';

function SheetDemo() {
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
        actions={<Button onClick={() => setOpen(false)}>Mostra 24 risultati</Button>}
      >
        <Flow direction="row" gap={2} wrap>
          {['Nuovo', 'Usato', 'Sotto i 500 €'].map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </Flow>
      </Sheet>
    </>
  );
}

const meta = {
  title: 'Componenti/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  args: { title: 'Filtri' },
  render: () => <SheetDemo />,
  parameters: {
    slurp: {
      anatomy: 'Dialog',
      a11y: [
        'Stessa API e stesso comportamento di `Dialog` (modale nativo, focus contenuto, Escape, ritorno del focus).',
        'Sale dal bordo in basso, a tutta larghezza sui telefoni; con `prefers-reduced-motion` compare e basta.',
      ],
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
