import { Rail, Surface } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Surface level="dock" radius="panel" css={{ p: 3, width: 260 }}>
      <Rail label="Impostazioni">
        <Rail.Group title="Account">
          <Rail.Link href="#profilo" current>
            Profilo
          </Rail.Link>
          <Rail.Link href="#sicurezza">Sicurezza</Rail.Link>
        </Rail.Group>
        <Rail.Group title="App">
          <Rail.Link href="#aspetto">Aspetto</Rail.Link>
          <Rail.Link href="#notifiche">Notifiche</Rail.Link>
        </Rail.Group>
      </Rail>
    </Surface>
  );
}
