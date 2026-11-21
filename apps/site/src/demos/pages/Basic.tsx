import { Pages } from '@slurp-ui/react';
import { useState } from 'react';

export default function Basic() {
  const [page, setPage] = useState(3);
  return <Pages count={12} page={page} onPageChange={setPage} />;
}
