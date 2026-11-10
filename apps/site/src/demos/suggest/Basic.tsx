import { Suggest } from '@slurp-ui/react';

const countries = [
  { value: 'it', label: 'Italia', description: 'Europa' },
  { value: 'ie', label: 'Irlanda', description: 'Europa' },
  { value: 'is', label: 'Islanda', description: 'Europa' },
  { value: 'in', label: 'India', description: 'Asia' },
  { value: 'id', label: 'Indonesia', description: 'Asia' },
  { value: 'ir', label: 'Iran', description: 'Asia' },
  { value: 'iq', label: 'Iraq', description: 'Asia' },
];

export default function Basic() {
  return (
    <div style={{ width: 360, minHeight: 300 }}>
      <Suggest label="Paese" placeholder="Scrivi un paese o un continente…" options={countries} />
    </div>
  );
}
