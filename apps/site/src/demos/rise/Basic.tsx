import { Flow, Rise, Surface, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow direction="row" gap={3} wrap>
      {['Accessibili', 'Con un tema', 'Leggeri'].map((title, i) => (
        <Rise key={title} delay={i * 60}>
          <Surface style={{ padding: 20, minWidth: 160 }}>
            <Text font="title-s">{title}</Text>
          </Surface>
        </Rise>
      ))}
    </Flow>
  );
}
