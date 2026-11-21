import { Button, FocusTrap, Surface } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Apri il pannello</Button>
      {open && (
        <FocusTrap onEscape={() => setOpen(false)}>
          <Surface
            style={{ padding: 20, marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <Button appearance="soft">Uno</Button>
            <Button appearance="soft">Due</Button>
            <Button onClick={() => setOpen(false)}>Chiudi</Button>
          </Surface>
        </FocusTrap>
      )}
    </div>
  );
}
