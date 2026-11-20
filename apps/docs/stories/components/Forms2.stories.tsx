import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Calendar,
  DateField,
  ErrorSummary,
  FileDrop,
  Flow,
  NumberField,
  PinField,
  SecretField,
} from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Form avanzati',
  component: DateField,
  tags: ['autodocs'],
  args: { label: 'Arrivo' },
  parameters: {
    slurp: {
      a11y: [
        'DateField: il campo cresce nel Calendar; il giorno corrente prende il focus; frecce, Pagina su/giù e Home/Fine per muoversi.',
        'NumberField: un `spinbutton` con i limiti; − e + sono bersagli da 44px e si spengono agli estremi.',
        'SecretField: resta `type="password"` finché non premi Mostra (bottone con stato).',
        'PinField: un solo campo sotto le caselle: incolla e suggerimento del codice funzionano.',
        'ErrorSummary: prende il focus dopo l’invio e porta a ogni campo con un link.',
      ],
    },
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Data: Story = { name: 'DateField' };

export const Periodo: Story = {
  args: { label: 'Soggiorno', range: true },
};

export const Calendario: Story = {
  render: () => (
    <Calendar
      defaultValue={{ start: '2026-12-08', end: '2026-12-11' }}
      range
      defaultMonth="2026-12-01"
    />
  ),
};

export const Altri: Story = {
  name: 'Numero, password, codice, file',
  render: () => (
    <Flow gap={6} css={{ maxWidth: 380 }}>
      <NumberField label="Persone" min={1} max={8} defaultValue={2} />
      <SecretField label="Password" hint="Almeno 12 caratteri" />
      <PinField label="Codice di verifica" hint="Lo trovi nel messaggio che ti abbiamo mandato" />
      <FileDrop label="Allegati" accept="image/*,.pdf" />
    </Flow>
  ),
};

export const Riepilogo: Story = {
  name: 'Riepilogo errori',
  render: () => (
    <ErrorSummary
      focusOnShow={false}
      errors={[
        { id: 'email', message: 'Scrivi un indirizzo email' },
        { id: 'password', message: 'La password è troppo corta' },
      ]}
    />
  ),
};
