import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bloom, Chip, Flow, Text } from '@slurp-ui/react';
import { CloseIcon, GearIcon } from '@slurp-ui/react/icons';

const meta = {
  title: 'Componenti/Bloom',
  component: Bloom,
  tags: ['autodocs'],
  args: { trigger: 'Filtri', panelLabel: 'Filtri', width: 320, placement: 'bottom-start' },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
  },
  render: (args) => (
    <div style={{ minHeight: 320 }}>
      <Bloom {...args}>
        <Text font="eyebrow" css={{ px: 2 }}>
          Condizione
        </Text>
        <Flow direction="row" gap={2} wrap css={{ p: 2 }}>
          {['Nuovo', 'Usato', 'Ricondizionato'].map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </Flow>
      </Bloom>
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Il trigger ha `aria-expanded` e `aria-controls`; il pannello è un `dialog` non modale (o `menu` / `listbox`) con il nome da `panelLabel`.',
        'Aprire porta il focus nel pannello; Escape chiude e lo riporta sul trigger; anche un clic fuori o Tab in uscita chiudono.',
        'Con un trigger di sola icona servono `label` e, da aperto, `closeLabel`.',
        'Con `prefers-reduced-motion` il pannello compare senza crescere.',
      ],
    },
  },
} satisfies Meta<typeof Bloom>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The button becomes the panel: one surface grows (width, height, radius) and shrinks back into the trigger. */
export const Playground: Story = {};

export const DaUnBubble: Story = {
  name: 'Da un bottone tondo',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 320 }}>
      <Bloom
        trigger={<GearIcon />}
        openTrigger={<CloseIcon />}
        label="Impostazioni"
        closeLabel="Chiudi impostazioni"
        placement="bottom-end"
        panelLabel="Impostazioni"
      >
        <Text font="title-s" css={{ px: 2, display: 'flex', alignItems: 'center' }}>
          Impostazioni
        </Text>
        <Flow gap={1} css={{ p: 2 }}>
          <Chip>Tema scuro</Chip>
        </Flow>
      </Bloom>
    </div>
  ),
};
