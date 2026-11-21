import { SecretField } from '@slurp-ui/react';

export default function Basic() {
  return <SecretField label="Password" hint="Almeno 12 caratteri" autoComplete="new-password" />;
}
