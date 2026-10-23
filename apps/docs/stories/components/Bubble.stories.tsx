import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, Flow, Hint } from '@slurp-ui/react';
import { GearIcon, SearchIcon } from '@slurp-ui/react/icons';

const APPEARANCES = ['fill', 'soft', 'outline', 'plain'] as const;

const meta = {
  title: 'Componenti/Bubble',
  component: Bubble,
  tags: ['autodocs'],
  args: { label: 'Impostazioni', children: <GearIcon />, appearance: 'plain', tone: 'neutral' },
  argTypes: {
    appearance: { control: 'inline-radio', options: APPEARANCES },
    tone: { control: 'inline-radio', options: ['accent', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  parameters: {
    slurp: {
      anatomy: ['Bubble', 'Button'],
      a11y: [
        '`label` è obbligatorio: è il nome accessibile del bottone, che mostra solo un’icona.',
        'L’icona è decorativa; per un suggerimento visibile avvolgi il Bubble in un `Hint` con lo stesso testo.',
        'Bersaglio di almeno 44px anche nella taglia `sm`.',
      ],
    },
  },
} satisfies Meta<typeof Bubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Aspetti: Story = {
  render: () => (
    <Flow direction="row" gap={3} align="center">
      {APPEARANCES.map((a) => (
        <Hint key={a} content={`Cerca (${a})`}>
          <Bubble label="Cerca" appearance={a} tone={a === 'fill' ? 'accent' : 'neutral'}>
            <SearchIcon />
          </Bubble>
        </Hint>
      ))}
    </Flow>
  ),
};
