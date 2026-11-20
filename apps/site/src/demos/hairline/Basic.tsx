import { Flow, Hairline, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow gap={4} css={{ width: 320 }}>
      <Text>Primo gruppo</Text>
      <Hairline />
      <Text>Secondo gruppo</Text>
      <Flow direction="row" gap={4} align="center">
        <Text>Recenti</Text>
        <Hairline orientation="vertical" />
        <Text>Preferiti</Text>
      </Flow>
    </Flow>
  );
}
