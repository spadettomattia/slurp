import { Carousel, Surface, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Carousel label="Novità">
      {['Primo', 'Secondo', 'Terzo'].map((t) => (
        <Surface key={t} style={{ padding: 32, minHeight: 120 }}>
          <Text font="title-s">{t}</Text>
        </Surface>
      ))}
    </Carousel>
  );
}
