import { Radio, RadioGroup } from '@slurp-ui/react';

export default function Basic() {
  return (
    <RadioGroup label="Frequenza" defaultValue="week">
      <Radio value="day">Ogni giorno</Radio>
      <Radio value="week">Ogni settimana</Radio>
      <Radio value="month">Ogni mese</Radio>
    </RadioGroup>
  );
}
