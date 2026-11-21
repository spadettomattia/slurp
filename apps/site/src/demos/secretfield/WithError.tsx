import { SecretField } from '@slurp-ui/react';

export default function WithError() {
  return (
    <SecretField label="Password" defaultValue="abc" error="Troppo corta: servono 12 caratteri." />
  );
}
