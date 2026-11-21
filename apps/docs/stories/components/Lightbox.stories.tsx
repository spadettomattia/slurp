import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Lightbox } from '@slurp-ui/react';
import { useState } from 'react';

const svg = (c: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${c}"/></svg>`)}`;

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri la galleria</Button>
      <Lightbox
        open={open}
        onOpenChange={setOpen}
        images={[
          { src: svg('#5b5bd6'), alt: 'Rettangolo viola', caption: 'Primo' },
          { src: svg('#2f9e6d'), alt: 'Rettangolo verde', caption: 'Secondo' },
          { src: svg('#d6805b'), alt: 'Rettangolo arancio', caption: 'Terzo' },
        ]}
      />
    </>
  );
}

const meta = {
  title: 'Componenti/Lightbox',
  component: Lightbox,
  tags: ['autodocs'],
  args: { images: [] },
  render: () => <Demo />,
  parameters: {
    slurp: {
      anatomy: 'Dialog',
      a11y: [
        'Costruito su `Dialog`: modale nativo, focus contenuto, Escape e ritorno del focus.',
        'Frecce sinistra/destra (invertite in RTL) o i bottoni passano alla successiva; la posizione “2 di 3” è la descrizione.',
      ],
    },
  },
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
