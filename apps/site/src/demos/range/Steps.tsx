import { Range } from '@slurp-ui/react';

export default function Steps() {
  return (
    <div style={{ width: 380 }}>
      <Range
        label="Dimensione del testo"
        min={12}
        max={24}
        step={2}
        defaultValue={16}
        formatValue={(v) => `${v} px`}
      />
    </div>
  );
}
