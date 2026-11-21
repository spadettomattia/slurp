import { Flow, Tag } from '@slurp-ui/react';

export default function Tones() {
  return (
    <Flow direction="row" gap={2} wrap>
      <Tag>Nuovo</Tag>
      <Tag tone="neutral">Bozza</Tag>
      <Tag tone="success">Verificato</Tag>
      <Tag tone="warning">In revisione</Tag>
      <Tag tone="danger">Scaduto</Tag>
    </Flow>
  );
}
