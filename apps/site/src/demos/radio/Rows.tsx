import { AutoIcon, MoonIcon, SunIcon } from '@slurp-ui/icons';
import { Radio, RadioGroup } from '@slurp-ui/react';

export default function Rows() {
  // The rows of the settings: full width, with an icon; the chosen one is accent-soft with a check.
  return (
    <div style={{ width: 320 }}>
      <RadioGroup label="Tema" defaultValue="system" appearance="rows">
        <Radio value="system" icon={<AutoIcon />}>
          Automatico
        </Radio>
        <Radio value="light" icon={<SunIcon />}>
          Chiaro
        </Radio>
        <Radio value="dark" icon={<MoonIcon />}>
          Scuro
        </Radio>
      </RadioGroup>
    </div>
  );
}
