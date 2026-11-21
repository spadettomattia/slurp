import { Flow, Progress } from '@slurp-ui/react';

export default function Shapes() {
  return (
    <Flow direction="row" gap={6} align="center" wrap>
      <div style={{ width: 240 }}>
        <Progress label="Caricamento" value={64} showValue />
      </div>
      <Progress label="Sincronizzazione" shape="ring" value={72} showValue />
    </Flow>
  );
}
