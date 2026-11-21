import { MultiSuggest } from '@slurp-ui/react';

const options = [
  { value: 'rosso', label: 'Rosso' },
  { value: 'verde', label: 'Verde' },
  { value: 'blu', label: 'Blu' },
  { value: 'giallo', label: 'Giallo', description: 'Caldo' },
];

export default function Basic() {
  return (
    <MultiSuggest label="Colori" hint="Scegline quanti vuoi." options={options} name="colori" />
  );
}
