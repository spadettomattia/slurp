import { Checkbox, Flow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow gap={2}>
      <Checkbox defaultChecked>Ricevi un riepilogo settimanale</Checkbox>
      <Checkbox>Mostra le anteprime</Checkbox>
      <Checkbox disabled>Sincronizza su tutti i dispositivi</Checkbox>
    </Flow>
  );
}
