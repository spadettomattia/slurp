import { Bubble, Hint } from '@slurp-ui/react';
import { CopyIcon } from '@slurp-ui/react/icons';

export default function Basic() {
  return (
    <Hint content="Copia il link">
      <Bubble label="Copia il link" appearance="soft" tone="neutral">
        <CopyIcon />
      </Bubble>
    </Hint>
  );
}
