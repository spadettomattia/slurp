import { Avatar, Flow } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Flow direction="row" gap={3} align="center">
      <Avatar name="Anna Rossi" size="sm" />
      <Avatar name="Luca Bianchi" />
      <Avatar name="Sara Verdi" size="lg" />
    </Flow>
  );
}
