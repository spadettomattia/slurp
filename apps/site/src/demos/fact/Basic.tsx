import { Fact, Flow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow direction="row" gap={2} wrap>
      <Fact label="Schermo" value="6,3″" />
      <Fact label="Memoria" value="256 GB" />
      <Fact label="Peso" value="199 g" />
    </Flow>
  );
}
