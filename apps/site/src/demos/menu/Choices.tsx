import { Menu } from '@slurp-ui/react';
import { useState } from 'react';

export default function Choices() {
  const [notes, setNotes] = useState(true);
  const [order, setOrder] = useState('new');
  return (
    <Menu trigger="Vista">
      <Menu.CheckboxItem checked={notes} onCheckedChange={setNotes}>
        Mostra le note
      </Menu.CheckboxItem>
      <Menu.Separator />
      <Menu.RadioGroup label="Ordina per" value={order} onValueChange={setOrder}>
        <Menu.RadioItem value="new">Più recenti</Menu.RadioItem>
        <Menu.RadioItem value="rel">Rilevanza</Menu.RadioItem>
      </Menu.RadioGroup>
    </Menu>
  );
}
