import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Flow } from '@slurp-ui/react';
import { ArrowLeftIcon, SearchIcon } from '@slurp-ui/react/icons';

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
  parameters: {
    slurp: {
      a11y: [
        'Un `<button type="button">`; con `href` diventa un link (`<a>`), con `as` un link del router.',
        'Bersagli di 44 / 48 / 56px (`sm` / `md` / `lg`) e un anello di focus visibile da 2px.',
        'Le icone (`icon`, `endIcon`) sono decorative: il testo del bottone resta il nome. Per un bottone con solo l’icona usa `Bubble`.',
        'Al posto di `disabled` puoi passare `aria-disabled="true"`: stesso aspetto, ma resta nell’ordine di Tab (utile accanto a una spiegazione). Il click arriva comunque: ignoralo nel tuo handler.',
      ],
    },
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
