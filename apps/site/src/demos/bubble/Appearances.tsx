import { CloseIcon, GearIcon, SearchIcon } from '@slurp-ui/icons';
import { Bubble } from '@slurp-ui/react';

export default function Appearances() {
  return (
    <>
      <Bubble label="Impostazioni">
        <GearIcon />
      </Bubble>
      <Bubble label="Cerca" appearance="soft">
        <SearchIcon />
      </Bubble>
      <Bubble label="Chiudi" appearance="outline">
        <CloseIcon />
      </Bubble>
      <Bubble label="Cerca" appearance="fill" tone="accent">
        <SearchIcon />
      </Bubble>
    </>
  );
}
