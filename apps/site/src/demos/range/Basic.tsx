import { Range } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div style={{ width: 380 }}>
      <Range label="Volume" defaultValue={60} formatValue={(v) => `${v}%`} />
    </div>
  );
}
