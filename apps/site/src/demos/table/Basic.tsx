import { Table, type TableColumn } from '@slurp-ui/react';

interface Row {
  name: string;
  role: string;
  score: number;
}
const rows: Row[] = [
  { name: 'Anna Rossi', role: 'Design', score: 92 },
  { name: 'Luca Bianchi', role: 'Sviluppo', score: 87 },
  { name: 'Sara Verdi', role: 'Contenuti', score: 95 },
];
const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Nome', rowHeader: true, sortable: true },
  { key: 'role', header: 'Ruolo' },
  { key: 'score', header: 'Punteggio', align: 'end', sortable: true },
];

export default function Basic() {
  return <Table caption="Persone" columns={columns} rows={rows} />;
}
