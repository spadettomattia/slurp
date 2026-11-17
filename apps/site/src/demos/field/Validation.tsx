import { Field } from '@slurp-ui/react';
import { useState } from 'react';

export default function Validation() {
  const [name, setName] = useState('');
  return (
    <div style={{ width: 360 }}>
      <Field
        label="Nome visualizzato"
        value={name}
        onValueChange={setName}
        error={name.trim().length < 3 ? 'Scrivi almeno 3 caratteri.' : undefined}
      />
    </div>
  );
}
