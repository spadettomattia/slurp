import { Calendar } from '@slurp-ui/react';

const weekend = (day: string) => [0, 6].includes(new Date(`${day}T12:00:00`).getDay());

export default function Disabled() {
  return <Calendar defaultMonth="2026-12-01" isDateDisabled={weekend} />;
}
