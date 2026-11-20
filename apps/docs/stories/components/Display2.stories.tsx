import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow, Footer, Kbd, Media, Quote, Tag, Text } from '@slurp-ui/react';

// A local picture (no network): soft shapes in the design system's hues.
const PICTURE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><rect width="960" height="540" fill="#1aa594"/><circle cx="300" cy="320" r="220" fill="#5882fe"/><circle cx="700" cy="200" r="160" fill="#8b6fff"/></svg>',
)}`;

const meta = {
  title: 'Componenti/Contenuti e media',
  component: Media,
  tags: ['autodocs'],
  args: {
    src: PICTURE,
    alt: 'Forme colorate',
    ratio: '16/9',
    caption: 'Una didascalia sotto la cornice',
  },
  parameters: {
    slurp: {
      a11y: [
        'Media: `alt` dice cosa mostra la foto (vuoto se decorativa); la cornice tiene lo spazio mentre carica.',
        'Tag: la parola dice lo stato, il colore lo accompagna.',
        'Footer: è il landmark `contentinfo`; ogni gruppo è una lista con il nome del suo titolo.',
      ],
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <Media {...args} />
    </div>
  ),
} satisfies Meta<typeof Media>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Immagine: Story = {};

export const Etichette: Story = {
  render: () => (
    <Flow direction="row" gap={2} wrap>
      <Tag>Nuovo</Tag>
      <Tag tone="neutral">Bozza</Tag>
      <Tag tone="success">Verificato</Tag>
      <Tag tone="warning">In attesa</Tag>
      <Tag tone="danger">Scaduto</Tag>
    </Flow>
  ),
};

export const Citazione: Story = {
  render: () => (
    <Flow gap={4} css={{ maxWidth: 520 }}>
      <Quote author="Nome Cognome" role="Ruolo, Organizzazione">
        Una citazione o una testimonianza, distinta dal resto del testo.
      </Quote>
      <Text>
        Premi <Kbd>⌘</Kbd> <Kbd>K</Kbd> per cercare.
      </Text>
    </Flow>
  ),
};

export const PiedeDiPagina: Story = {
  name: 'Footer',
  render: () => (
    <Footer>
      <Footer.Group title="Prodotto">
        <Footer.Link href="#panoramica">Panoramica</Footer.Link>
        <Footer.Link href="#novita">Novità</Footer.Link>
      </Footer.Group>
      <Footer.Group title="Risorse">
        <Footer.Link href="#guide">Guide</Footer.Link>
        <Footer.Link href="#aiuto">Aiuto</Footer.Link>
      </Footer.Group>
      <Footer.Bottom>
        <span>© Nome dell’organizzazione</span>
        <span>Privacy · Termini</span>
      </Footer.Bottom>
    </Footer>
  ),
};
