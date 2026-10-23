import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Flow } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Field',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Email', hint: 'Ti scriviamo solo per l’ordine.', placeholder: 'nome@esempio.it' },
  parameters: {
    slurp: {
      a11y: [
        'L’etichetta visibile è obbligatoria e collegata all’input: il placeholder non sostituisce l’etichetta.',
        '`hint` ed `error` sono collegati con `aria-describedby`; con `error` il campo ha `aria-invalid` e il messaggio un’icona, non solo il rosso.',
        'Il bordo del campo usa `border-control` (contrasto 3:1 con lo sfondo).',
      ],
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

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
