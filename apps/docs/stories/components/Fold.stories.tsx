import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fold, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Fold',
  component: Fold,
  tags: ['autodocs'],
  args: {
    summary: 'Spedizione e resi',
    defaultOpen: true,
    children: <Text>Spedizione gratuita sopra i 50 €. Reso entro 30 giorni.</Text>,
  },
  argTypes: { children: { control: false } },
  parameters: {
    slurp: {
      a11y: [
        'Il bottone sta in un titolo (`headingLevel`, h3 di default): i lettori di schermo lo trovano tra i titoli.',
        '`aria-expanded` e `aria-controls` collegano il bottone alla sua `region`, che ha il nome del bottone.',
        'Chiuso, il contenuto è `inert`: fuori dall’ordine di Tab e dalla lettura.',
      ],
    },
  },
} satisfies Meta<typeof Fold>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Elenco: Story = {
  name: 'Più Fold di seguito',
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Fold summary="Spedizione e resi" defaultOpen>
        <Text>Spedizione gratuita sopra i 50 €. Reso entro 30 giorni.</Text>
      </Fold>
      <Fold summary="Garanzia">
        <Text>Due anni, estendibile a tre.</Text>
      </Fold>
      <Fold summary="Pagamenti">
        <Text>Carta, bonifico o in tre rate.</Text>
      </Fold>
    </div>
  ),
};
