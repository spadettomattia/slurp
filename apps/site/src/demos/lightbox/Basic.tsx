import { Button, Lightbox } from '@slurp-ui/react';
import { useState } from 'react';

const svg = (c: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${c}"/></svg>`)}`;

export default function Basic() {
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
        ]}
      />
    </>
  );
}
