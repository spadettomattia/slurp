import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Fold, Notice, Placeholder, Progress, Surface, Tabs, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Stato e contenuti',
  component: Notice,
  tags: ['autodocs'],
  args: { tone: 'neutral', children: 'Le consegne riprendono lunedì.' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'danger'] },
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoticePlayground: Story = { name: 'Notice' };

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

export const Avanzamento: Story = {
  render: () => (
    <Flow gap={5} css={{ maxWidth: 420 }}>
      <Progress label="Caricamento foto" value={62} showValue />
      <Progress label="Ricerca in corso" />
      <Flow direction="row" gap={5} align="center">
        <Progress
          label="Spazio usato"
          value={7.4}
          max={10}
          shape="ring"
          size={64}
          showValue
          formatValue={(v) => v.toFixed(1)}
        />
        <Progress label="Attesa" shape="ring" />
      </Flow>
    </Flow>
  ),
};

export const Segnaposto: Story = {
  render: () => (
    <Surface
      as="section"
      css={{ p: 5, maxWidth: 360 }}
      aria-busy="true"
      aria-label="Scheda in caricamento"
    >
      <Flow gap={3}>
        <Flow direction="row" gap={3} align="center">
          <Placeholder shape="circle" />
          <Flow gap={2} css={{ flex: 1 }}>
            <Placeholder width="70%" />
            <Placeholder width="40%" height={12} />
          </Flow>
        </Flow>
        <Placeholder shape="square" width="100%" />
      </Flow>
    </Surface>
  ),
};

export const SchedeEFold: Story = {
  name: 'Tabs e Fold',
  render: () => (
    <Flow gap={6} css={{ maxWidth: 560 }}>
      <Tabs
        label="Dettagli prodotto"
        items={[
          {
            value: 'desc',
            label: 'Descrizione',
            content: <Text>Schermo da 6,1 pollici, 128 GB.</Text>,
          },
          {
            value: 'spec',
            label: 'Specifiche',
            content: <Text>Peso 170 g, batteria 3.500 mAh.</Text>,
          },
          { value: 'rev', label: 'Recensioni', content: <Text>Media 9.1 su 10.</Text> },
        ]}
      />
      <div>
        <Fold summary="Spedizione e resi" defaultOpen>
          <Text>Spedizione gratuita sopra i 50 €. Reso entro 30 giorni.</Text>
        </Fold>
        <Fold summary="Garanzia">
          <Text>Due anni, estendibile a tre.</Text>
        </Fold>
      </div>
    </Flow>
  ),
};
