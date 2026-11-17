import { Field } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ width: 360 }}>
      <Field
        label="Email"
        type="email"
        placeholder="nome@esempio.it"
        hint="La usiamo solo per gli avvisi che scegli tu."
      />
    </div>
  );
}
