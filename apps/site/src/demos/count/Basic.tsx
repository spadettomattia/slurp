import { Avatar, Count } from '@slurp-ui/react';

export default function Basic() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <Avatar name="Persona di esempio" />
      <Count value={3} label={(n) => `${n} nuovi messaggi`} />
    </span>
  );
}
