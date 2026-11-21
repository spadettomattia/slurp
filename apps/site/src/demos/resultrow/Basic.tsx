import { Flow, ResultRow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow gap={1} css={{ maxWidth: 480 }}>
      <ResultRow title="Cuffie senza fili" meta="Audio" value="59 €" />
      <ResultRow title="Smartphone" meta="Telefoni" value="369 €" />
    </Flow>
  );
}
