import { Flow, Rating } from '@slurp-ui/react';

export default function ReadOnly() {
  return (
    <Flow gap={3}>
      <Rating label="Media" value={4.5} readOnly />
      <Rating label="Media" value={3.2} readOnly size="sm" />
      <Rating label="Media" value={2.8} readOnly size="lg" max={5} />
    </Flow>
  );
}
