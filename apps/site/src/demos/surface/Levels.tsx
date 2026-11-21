import { Flow, Surface, Text } from '@slurp-ui/react';

export default function Levels() {
  return (
    <Flow direction="row" gap={3} wrap>
      {(['surface', 'dock', 'solid'] as const).map((level) => (
        <Surface key={level} level={level} radius="card" style={{ padding: 20, minWidth: 140 }}>
          <Text font="title-s">{level}</Text>
        </Surface>
      ))}
    </Flow>
  );
}
