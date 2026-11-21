import { Table, type TableColumn } from '@slurp-ui/react';
import { useState } from 'react';
import type { Key } from 'react';

interface Row {
  name: string;
  role: string;
}
const rows: Row[] = [
  { name: 'Anna Rossi', role: 'Design' },
  { name: 'Luca Bianchi', role: 'Sviluppo' },
  { name: 'Sara Verdi', role: 'Contenuti' },
];
const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Nome', rowHeader: true },
  { key: 'role', header: 'Ruolo' },
];

export default function Selectable() {
  const [selected, setSelected] = useState<Key[]>([]);
  return (
    <Table
      caption={`Persone (${selected.length} selezionate)`}
      columns={columns}
      rows={rows}
      rowKey={(r) => (r as Row).name}
      selectable
      selected={selected}
      onSelectedChange={setSelected}
      maxHeight={220}
    />
  );
}
