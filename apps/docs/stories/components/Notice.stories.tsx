import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Notice } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Notice',
  component: Notice,
  tags: ['autodocs'],
  args: { tone: 'neutral', children: 'Le consegne riprendono lunedì.' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'danger'] },
  },
  parameters: {
    slurp: {
      a11y: [
        '`role="status"`: annunciato con garbo quando compare. Per un errore che deve interrompere passa `role="alert"`.',
        'Lo stato è un’icona più una parola (il titolo, di default la parola del tono): mai solo il colore.',
        'Con `onDismiss` compare un bottone di chiusura con un nome (`labels.dismiss`).',
      ],
    },
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Toni: Story = {
  render: () => (
    <Flow gap={3} css={{ maxWidth: 520 }}>
      <Notice>Le consegne riprendono lunedì.</Notice>
      <Notice tone="success">Ordine confermato.</Notice>
      <Notice tone="warning" onDismiss={() => undefined}>
        Ne restano solo 2.
      </Notice>
      <Notice tone="danger" role="alert" title="Pagamento non riuscito">
        La carta è stata rifiutata.
      </Notice>
    </Flow>
  ),
};
