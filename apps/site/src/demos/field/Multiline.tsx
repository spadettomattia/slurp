import { Field } from '@slurp-ui/react';

export default function Multiline() {
  return (
    <div style={{ width: 420 }}>
      <Field label="Note" multiline rows={4} hint="Facoltative." />
    </div>
  );
}
