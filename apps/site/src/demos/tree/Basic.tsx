import { Tree } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Tree
      label="Documenti"
      defaultExpanded={['guide']}
      items={[
        {
          id: 'guide',
          label: 'Guide',
          children: [
            { id: 'start', label: 'Primi passi' },
            { id: 'theme', label: 'Tema' },
          ],
        },
        { id: 'api', label: 'Riferimento', children: [{ id: 'props', label: 'Proprietà' }] },
        { id: 'notes', label: 'Note di rilascio' },
      ]}
    />
  );
}
