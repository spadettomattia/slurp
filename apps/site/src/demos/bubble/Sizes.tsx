import { SearchIcon } from '@slurp-ui/icons';
import { Bubble } from '@slurp-ui/react';

export default function Sizes() {
  return (
    <>
      <Bubble label="Cerca" appearance="soft" size="sm">
        <SearchIcon />
      </Bubble>
      <Bubble label="Cerca" appearance="soft" size="md">
        <SearchIcon />
      </Bubble>
      <Bubble label="Cerca" appearance="soft" size="lg">
        <SearchIcon />
      </Bubble>
    </>
  );
}
