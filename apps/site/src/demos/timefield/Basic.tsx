import { TimeField } from '@slurp-ui/react';

export default function Basic() {
  return (
    <TimeField
      label="Orario di arrivo"
      hint="Dalle 8 alle 18"
      min="08:00"
      max="18:00"
      step={900}
      defaultValue="09:30"
    />
  );
}
