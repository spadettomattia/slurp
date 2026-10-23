import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Checkbox,
  Choice,
  Field,
  Flow,
  Radio,
  RadioGroup,
  Range,
  Search,
  Surface,
  Switch,
} from '@slurp-ui/react';
import { useState } from 'react';

const meta = {
  title: 'Componenti/Form',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Email', hint: 'Ti scriviamo solo per l’ordine.', placeholder: 'nome@esempio.it' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FieldPlayground: Story = { name: 'Field' };

export const Stati: Story = {
  render: () => (
    <Flow gap={5} css={{ maxWidth: 420 }}>
      <Field label="Nome" defaultValue="Ada" />
      <Field label="Email" defaultValue="ada@" error="Manca il dominio dopo la chiocciola." />
      <Field label="Note per il corriere" multiline hint="Facoltative." />
      <Field label="Codice sconto" disabled defaultValue="SLURP10" />
    </Flow>
  ),
};

function SearchDemo() {
  const [q, setQ] = useState('');
  const items = ['iPhone 16', 'Pixel 9', 'Galaxy S25', 'Xperia 1'];
  const found = items.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
  return (
    <Flow gap={3} css={{ maxWidth: 420 }}>
      <Search
        value={q}
        onValueChange={setQ}
        count={found.length}
        labels={{ placeholder: 'Cerca in Smartphone…' }}
      />
    </Flow>
  );
}

export const Ricerca: Story = { render: () => <SearchDemo /> };

export const Selezioni: Story = {
  render: () => (
    <Surface css={{ p: 6, maxWidth: 460 }}>
      <Flow gap={5}>
        <Choice
          label="Ordina per"
          defaultValue="relevance"
          options={[
            { value: 'relevance', label: 'Rilevanza' },
            { value: 'price-asc', label: 'Prezzo crescente' },
            { value: 'price-desc', label: 'Prezzo decrescente' },
            { value: 'score', label: 'Punteggio' },
          ]}
        />
        <RadioGroup label="Spedizione" defaultValue="standard">
          <Radio value="standard">Standard, 3–5 giorni</Radio>
          <Radio value="express">Espressa, 24 ore</Radio>
          <Radio value="pickup" disabled>
            Ritiro in negozio
          </Radio>
        </RadioGroup>
        <Flow gap={1}>
          <Checkbox defaultChecked>Ricevi aggiornamenti sull’ordine</Checkbox>
          <Checkbox indeterminate>Seleziona tutto</Checkbox>
          <Switch defaultChecked>Notifiche</Switch>
        </Flow>
        <Range
          label="Prezzo massimo"
          min={0}
          max={2000}
          step={50}
          defaultValue={900}
          formatValue={(v) => `${v.toLocaleString('it-IT')} €`}
        />
      </Flow>
    </Surface>
  ),
};
