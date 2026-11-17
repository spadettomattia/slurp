import { Radio, RadioGroup } from '@slurp-ui/react';

export default function Horizontal() {
  return (
    <RadioGroup label="Densità" defaultValue="normal" orientation="horizontal">
      <Radio value="compact">Compatta</Radio>
      <Radio value="normal">Normale</Radio>
      <Radio value="wide">Ampia</Radio>
    </RadioGroup>
  );
}
