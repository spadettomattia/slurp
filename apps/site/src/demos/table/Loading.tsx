import { Table, type TableColumn } from '@slurp-ui/react';
import { useState } from 'react';

interface Row {
  name: string;
  role: string;
}
const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Nome', rowHeader: true },
  { key: 'role', header: 'Ruolo' },
];
const rows: Row[] = [
  { name: 'Anna Rossi', role: 'Design' },
  { name: 'Luca Bianchi', role: 'Sviluppo' },
];

export default function Loading() {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <label style={{ display: 'inline-flex', gap: 8, marginBottom: 12 }}>
        <input type="checkbox" checked={loading} onChange={(e) => setLoading(e.target.checked)} />{' '}
        In caricamento
      </label>
      <Table caption="Persone" columns={columns} rows={rows} loading={loading} loadingRows={3} />
    </div>
  );
}
