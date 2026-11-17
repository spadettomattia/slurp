import { FiltersIcon, SearchIcon } from '@slurp-ui/icons';
import { Chip } from '@slurp-ui/react';

export default function Icon() {
  // The icon gives way to the check while the chip is selected.
  return (
    <>
      <Chip icon={<SearchIcon />}>Testo</Chip>
      <Chip icon={<FiltersIcon />} defaultSelected>
        Avanzate
      </Chip>
    </>
  );
}
