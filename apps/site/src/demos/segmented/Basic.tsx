import { Segmented } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Segmented
      label="Vista"
      defaultValue="grid"
      options={[
        { value: 'grid', label: 'Griglia' },
        { value: 'list', label: 'Lista' },
        { value: 'board', label: 'Bacheca' },
      ]}
    />
  );
}
