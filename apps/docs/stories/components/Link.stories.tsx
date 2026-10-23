import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Link',
  component: Link,
  tags: ['autodocs'],
  args: { href: '#garanzia', children: 'Leggi le condizioni di garanzia' },
  parameters: {
    slurp: {
      a11y: [
        'Un `<a>` vero (o il link del tuo router con `as`): Invio lo segue, il menu contestuale lo apre in un’altra scheda.',
        'Accent-ink e sottolineato: riconoscibile anche senza colori.',
        'Il testo deve dire dove porta (“Leggi le condizioni”, non “clicca qui”).',
      ],
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NelTesto: Story = {
  name: 'Nel testo',
  render: () => (
    <Text css={{ maxWidth: 480 }}>
      Il reso è gratuito entro 30 giorni. <Link href="#resi">Come restituire un prodotto</Link>.
    </Text>
  ),
};
