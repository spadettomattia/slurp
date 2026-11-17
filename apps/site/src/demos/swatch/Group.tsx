import { SwatchGroup } from '@slurp-ui/react';

export default function Group() {
  return (
    <SwatchGroup
      label="Colore"
      defaultValue="sage"
      options={[
        { value: 'night', color: '#1f2a44', label: 'Blu notte' },
        { value: 'sand', color: '#d9c7a7', label: 'Sabbia' },
        { value: 'sage', color: '#9bb59a', label: 'Salvia' },
        { value: 'coral', color: '#f0745f', label: 'Corallo' },
      ]}
    />
  );
}
