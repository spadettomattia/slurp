import { VisuallyHidden } from '@slurp-ui/react';
import { SearchIcon } from '@slurp-ui/react/icons';

export default function Basic() {
  return (
    <a href="#cerca">
      <SearchIcon />
      <VisuallyHidden>Cerca</VisuallyHidden>
    </a>
  );
}
