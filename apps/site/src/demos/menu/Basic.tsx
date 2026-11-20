import { Menu, MenuItem } from '@slurp-ui/react';
import { CopyIcon, EditIcon, TrashIcon } from '@slurp-ui/react/icons';

export default function Basic() {
  return (
    <div style={{ minHeight: 260 }}>
      <Menu trigger="Azioni">
        <MenuItem icon={<EditIcon />}>Modifica</MenuItem>
        <MenuItem icon={<CopyIcon />}>Duplica</MenuItem>
        <MenuItem disabled>Archivia</MenuItem>
        <MenuItem tone="danger" icon={<TrashIcon />}>
          Elimina
        </MenuItem>
      </Menu>
    </div>
  );
}
