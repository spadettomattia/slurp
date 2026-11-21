import { AvatarGroup } from '@slurp-ui/react';

const people = [
  'Anna Rossi',
  'Luca Bianchi',
  'Sara Verdi',
  'Marco Neri',
  'Elena Gialli',
  'Paolo Blu',
].map((name) => ({ name }));

export default function Basic() {
  return <AvatarGroup label="Partecipanti" people={people} max={4} />;
}
