import { FileDrop } from '@slurp-ui/react';

export default function Basic() {
  return (
    <FileDrop
      label="Allegati"
      hint="PDF o immagini, fino a 5 file"
      accept="application/pdf,image/*"
      multiple
    />
  );
}
