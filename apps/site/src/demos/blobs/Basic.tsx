import { Blobs, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ position: 'relative', minHeight: 220, overflow: 'hidden', borderRadius: 32 }}>
      <Blobs count={3} />
      <div style={{ position: 'relative', zIndex: 1, padding: 32 }}>
        <Text font="title-l" as="h3">
          Un fondo che respira
        </Text>
      </div>
    </div>
  );
}
