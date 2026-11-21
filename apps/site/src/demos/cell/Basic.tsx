import { Cell } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Cell
      as="section"
      css={{
        padding: 'var(--slurp-space-4)',
        borderRadius: 'var(--slurp-radius-md)',
        background: 'var(--slurp-accent-soft)',
      }}
    >
      Una sezione con i valori del tema.
    </Cell>
  );
}
