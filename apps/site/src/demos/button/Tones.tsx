import { Button } from '@slurp-ui/react';

export default function Tones() {
  return (
    <>
      <Button tone="neutral">Neutro</Button>
      <Button tone="neutral" appearance="soft">
        Neutro soft
      </Button>
      <Button tone="neutral" appearance="outline">
        Neutro outline
      </Button>
    </>
  );
}
