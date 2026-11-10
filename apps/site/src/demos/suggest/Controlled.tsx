import { Suggest, Text } from '@slurp-ui/react';
import { useState } from 'react';

const colors = [
  { value: 'midnight', label: 'Mezzanotte' },
  { value: 'sage', label: 'Salvia' },
  { value: 'sky', label: 'Cielo' },
  { value: 'sand', label: 'Sabbia' },
];

export default function Controlled() {
  const [color, setColor] = useState<string | null>('sage');
  return (
    <div style={{ width: 360, minHeight: 280 }}>
      <Suggest label="Colore" options={colors} value={color} onValueChange={setColor} openOnFocus />
      <Text font="caption" style={{ marginTop: 12 }}>
        value: {JSON.stringify(color)}
      </Text>
    </div>
  );
}
