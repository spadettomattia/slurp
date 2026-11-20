import { Button, SkipLink, Text } from '@slurp-ui/react';

export default function Basic() {
  return (
    <div>
      <SkipLink href="#demo-contenuto" css={{ position: 'absolute' }} />
      <Text font="body-s" muted>
        Porta il focus qui sopra e premi Tab: il link compare in alto a sinistra.
      </Text>
      <div id="demo-contenuto" tabIndex={-1}>
        <Button appearance="soft">Contenuto</Button>
      </div>
    </div>
  );
}
