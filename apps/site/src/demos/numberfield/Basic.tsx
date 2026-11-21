import { NumberField } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [people, setPeople] = useState(2);
  return (
    <NumberField
      label="Persone"
      hint={`${people} selezionate`}
      min={1}
      max={8}
      value={people}
      onValueChange={setPeople}
    />
  );
}
