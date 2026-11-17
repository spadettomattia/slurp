import { Choice } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ minHeight: 280 }}>
      <Choice
        label="Ordina per"
        defaultValue="relevance"
        options={[
          { value: 'relevance', label: 'Rilevanza' },
          { value: 'newest', label: 'Più recenti' },
          { value: 'name', label: 'Nome' },
          { value: 'size', label: 'Dimensione', disabled: true },
        ]}
      />
    </div>
  );
}
