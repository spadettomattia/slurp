import { Score, Stage } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Stage color="#ef1cac" style={{ maxWidth: 520 }}>
      <Score score={9.1} />
    </Stage>
  );
}
