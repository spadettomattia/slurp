import { Mark, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Text font="body-l" css={{ maxWidth: 560 }}>
      <Mark
        text="Un telefono più leggero, con più autonomia e uno schermo più luminoso."
        query="più"
      />
    </Text>
  );
}
