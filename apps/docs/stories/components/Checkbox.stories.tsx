import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Flow } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { children: 'Ricevi aggiornamenti sull’ordine', defaultChecked: true },
  parameters: {
    slurp: {
      a11y: [
        'Un `<input type="checkbox">` nativo dentro la sua etichetta: Spazio lo cambia, il form lo invia.',
        'Selezionato = riempimento accent con la spunta; `indeterminate` mostra un trattino ed è annunciato come “misto”.',
      ],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Stati: Story = {
  render: () => (
    <Flow gap={1}>
      <Checkbox>Non selezionato</Checkbox>
      <Checkbox defaultChecked>Selezionato</Checkbox>
      <Checkbox indeterminate>Seleziona tutto</Checkbox>
      <Checkbox disabled>Non disponibile</Checkbox>
    </Flow>
  ),
};
