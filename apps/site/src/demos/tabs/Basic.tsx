import { Tabs } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Tabs
      label="Sezioni"
      defaultValue="uso"
      items={[
        { value: 'uso', label: 'Uso', content: 'Come si usa.' },
        { value: 'api', label: 'API', content: 'Le proprietà.' },
        { value: 'tema', label: 'Tema', content: 'Come si personalizza.' },
      ]}
    />
  );
}
