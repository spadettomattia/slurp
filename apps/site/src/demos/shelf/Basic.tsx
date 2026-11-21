import { Card, Shelf } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Shelf>
      {['Prima', 'Seconda', 'Terza', 'Quarta'].map((name, i) => (
        <Card
          key={name}
          href="#scheda"
          title={`Scheda ${name}`}
          description="Serie 1"
          value={`${59 + i * 70} €`}
          valuePrefix="da"
          color="#ef1cac"
        />
      ))}
    </Shelf>
  );
}
