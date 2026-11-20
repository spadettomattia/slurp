import { Code } from '@slurp-ui/react';

const SNIPPET = `import { Button } from '@slurp-ui/react';

export function Save() {
  return <Button>Salva</Button>;
}`;

export default function Basic() {
  return <Code filename="Save.tsx" code={SNIPPET} language="tsx" css={{ width: '100%' }} />;
}
