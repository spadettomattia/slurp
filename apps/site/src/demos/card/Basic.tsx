import { Card } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ width: 260 }}>
      <Card
        href="#scheda"
        title="Cuffie senza fili"
        description="Serie 1"
        value="59 €"
        valuePrefix="da"
        badge="Novità"
        color="#ef1cac"
      />
    </div>
  );
}
