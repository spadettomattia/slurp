import { Notice, PinField } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [code, setCode] = useState<string | null>(null);
  return (
    <>
      <PinField label="Codice di verifica" length={6} onComplete={setCode} />
      {code && (
        <Notice tone="success" title="Codice inserito">
          {code}
        </Notice>
      )}
    </>
  );
}
