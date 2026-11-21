import { Steps } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [step, setStep] = useState('details');
  return (
    <Steps
      value={step}
      onValueChange={setStep}
      navigable="done"
      steps={[
        { value: 'choice', label: 'Scelta' },
        { value: 'details', label: 'Dettagli' },
        { value: 'confirm', label: 'Conferma' },
      ]}
    />
  );
}
