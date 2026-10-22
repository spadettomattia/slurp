import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Text } from '@slurp-ui/react';
import { font } from '@slurp-ui/react/tokens';

const meta = {
  title: 'Fondamenta/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'Di cosa hai bisogno?', font: 'display-xl' },
  argTypes: {
    font: { control: 'select', options: Object.keys(font) },
    tone: {
      control: 'inline-radio',
      options: [undefined, 'neutral', 'accent', 'success', 'warning', 'danger'],
    },
    muted: { control: 'boolean' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scala: Story = {
  render: () => (
    <Flow gap={3}>
      <Text font="eyebrow">Etichetta di sezione</Text>
      <Text font="display-xl">Di cosa hai bisogno?</Text>
      <Text font="display-l" as="p">
        Titolo di dettaglio
      </Text>
      <Text font="title-xl">Titolo di sezione</Text>
      <Text font="figure">1.239 €</Text>
      <Text font="tile-label" as="p">
        Categoria
      </Text>
      <Text font="title-l">Titolo del pannello</Text>
      <Text font="title-s">Titolo della card</Text>
      <Text font="body-l" muted>
        Un testo introduttivo breve, leggibile e scritto in modo diretto.
      </Text>
      <Text>Il corpo del testo usa righe di massimo 70 caratteri e interlinea 1.6.</Text>
      <Text font="body-s">Voce di elenco</Text>
      <Text font="label">Azione principale</Text>
      <Text font="caption">Informazione secondaria · 2 elementi</Text>
    </Flow>
  ),
};

export const Toni: Story = {
  render: () => (
    <Flow gap={2}>
      <Text tone="accent">Testo d&apos;accento (accent-ink)</Text>
      <Text tone="success">Disponibile · consegna domani</Text>
      <Text tone="warning">Attenzione · ultimi pezzi</Text>
      <Text tone="danger">Errore · campo obbligatorio</Text>
      <Text muted>Testo secondario</Text>
    </Flow>
  ),
};
