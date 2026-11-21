import { Flow, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow gap={2}>
      <Text font="title-l" as="h3">
        Un titolo
      </Text>
      <Text>Il testo di base, in Poppins a 16px.</Text>
      <Text muted>Una nota secondaria.</Text>
      <Text tone="danger" font="body-s">
        Un avviso, sempre con parole.
      </Text>
    </Flow>
  );
}
