import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reveal } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  args: {
    children:
      'Un solo posto per navigare, controlli che restano accessibili e un tema che segue il tuo colore.',
  },
  parameters: {
    layout: 'padded',
    slurp: {
      a11y: [
        'Il testo è un solo paragrafo: un lettore di schermo lo legge intero, a prescindere dallo scorrimento.',
        'Le parole passano da `muted` a `fg`, entrambi con contrasto AA: la frase si legge anche prima che si accenda. Con `prefers-reduced-motion` è subito tutta accesa.',
        'Si usa una volta per pagina, in una sezione propria: è un cambio di colore guidato dallo scorrimento, non una transizione.',
      ],
    },
  },
  render: (args) => (
    <div>
      <div style={{ height: '55vh' }}>Scorri</div>
      <Reveal {...args} />
      <div style={{ height: '70vh' }} />
    </div>
  ),
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
