import { ArrowLeftIcon, ChevronRightIcon, SearchIcon } from '@slurp-ui/icons';
import { Bubble, Button } from '@slurp-ui/react';

export default function Icons() {
  return (
    <>
      <Button appearance="soft" icon={<ArrowLeftIcon />}>
        Indietro
      </Button>
      <Button endIcon={<ChevronRightIcon />}>Continua</Button>
      {/* Icon only: Bubble, with the name it needs. */}
      <Bubble label="Cerca" appearance="soft">
        <SearchIcon />
      </Bubble>
    </>
  );
}
