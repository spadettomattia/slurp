import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    label: 'Dettagli prodotto',
    items: [
      {
        value: 'desc',
        label: 'Descrizione',
        content: <Text>Schermo da 6,1 pollici, 128 GB.</Text>,
      },
      { value: 'spec', label: 'Specifiche', content: <Text>Peso 170 g, batteria 3.500 mAh.</Text> },
      { value: 'rev', label: 'Recensioni', content: <Text>Media 9.1 su 10.</Text> },
      { value: 'faq', label: 'Domande', disabled: true },
    ],
  },
  argTypes: { items: { control: false } },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Tabs {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        '`tablist` con il nome da `label`, ogni scheda un `tab` con `aria-selected` collegato al suo `tabpanel`.',
        'Una fermata di Tab: le frecce spostano e selezionano, Home / Fine vanno agli estremi; poi Tab entra nel pannello.',
        'L’indicatore a pillola si muove su una molla; con `prefers-reduced-motion` si sposta senza animazione.',
      ],
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
