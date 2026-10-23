import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, Button, Flow, Hint, Text } from '@slurp-ui/react';
import { ArrowLeftIcon, GearIcon, SearchIcon } from '@slurp-ui/react/icons';

const APPEARANCES = ['fill', 'soft', 'outline', 'plain'] as const;

const meta = {
  title: 'Componenti/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Aggiungi al carrello', appearance: 'fill', tone: 'accent', size: 'md' },
  argTypes: {
    appearance: { control: 'inline-radio', options: APPEARANCES },
    tone: { control: 'inline-radio', options: ['accent', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Aspetti: Story = {
  render: () => (
    <Flow gap={5}>
      {(['accent', 'neutral'] as const).map((tone) => (
        <Flow key={tone} direction="row" gap={3} wrap align="center">
          {APPEARANCES.map((a) => (
            <Button key={a} appearance={a} tone={tone}>
              {a}
            </Button>
          ))}
          <Button tone={tone} disabled>
            Disattivato
          </Button>
        </Flow>
      ))}
    </Flow>
  ),
};

export const ConIcona: Story = {
  name: 'Con icona e link',
  render: () => (
    <Flow direction="row" gap={3} wrap align="center">
      <Button icon={<ArrowLeftIcon />} appearance="outline" tone="neutral">
        Indietro
      </Button>
      <Button endIcon={<SearchIcon />}>Cerca</Button>
      <Button href="#catalogo" appearance="soft">
        Vai al catalogo
      </Button>
    </Flow>
  ),
};

export const BubbleRotondo: Story = {
  name: 'Bubble (solo icona)',
  render: () => (
    <Flow gap={3}>
      <Flow direction="row" gap={3} align="center">
        {APPEARANCES.map((a) => (
          <Hint key={a} content={`Impostazioni (${a})`}>
            <Bubble label="Impostazioni" appearance={a} tone={a === 'fill' ? 'accent' : 'neutral'}>
              <GearIcon />
            </Bubble>
          </Hint>
        ))}
      </Flow>
      <Text font="caption" muted>
        Il nome accessibile è obbligatorio (label); il suggerimento compare al passaggio o al focus.
      </Text>
    </Flow>
  ),
};
