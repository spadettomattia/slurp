import { Flow, Segmented, Text } from '@slurp-ui/react';
import { useState } from 'react';

const PERIODS = [
  { value: 'day', label: 'Giorno' },
  { value: 'week', label: 'Settimana' },
  { value: 'month', label: 'Mese' },
];

export default function Controlled() {
  const [period, setPeriod] = useState('week');
  return (
    <Flow gap={3} align="center">
      <Segmented
        label="Periodo"
        options={PERIODS}
        value={period}
        onValueChange={setPeriod}
        size="sm"
      />
      <Text font="caption">value: {period}</Text>
    </Flow>
  );
}
