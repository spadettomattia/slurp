import type { Meta, StoryObj } from '@storybook/react-vite';
import { Consent, Link } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Consent',
  component: Consent,
  tags: ['autodocs'],
  args: {
    title: 'Preferenze sui cookie',
    onCustomize: () => undefined,
    children: (
      <>
        Usiamo cookie tecnici e, con il tuo consenso, di misura.{' '}
        <Link href="#privacy">Informativa</Link>
      </>
    ),
  },
  parameters: {
    layout: 'fullscreen',
    slurp: {
      a11y: [
        'Una regione con nome, non modale: la pagina resta usabile e il focus non viene catturato.',
        'Accetta e Rifiuta hanno lo stesso peso: rifiutare è facile quanto accettare.',
      ],
    },
  },
} satisfies Meta<typeof Consent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
