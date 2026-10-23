import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from '@slurp-ui/react';
import { AutoIcon, MoonIcon, SunIcon } from '@slurp-ui/react/icons';

const meta = {
  title: 'Componenti/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { label: 'Spedizione', defaultValue: 'standard' },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['default', 'rows'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="standard">Standard, 3–5 giorni</Radio>
      <Radio value="express">Espressa, 24 ore</Radio>
      <Radio value="pickup" disabled>
        Ritiro in negozio
      </Radio>
    </RadioGroup>
  ),
  parameters: {
    slurp: {
      a11y: [
        '`RadioGroup` è un `<fieldset>` con `label` come `<legend>`: il gruppo ha un nome.',
        'Radio nativi: una fermata di Tab per gruppo, le frecce spostano e selezionano.',
        'Il radio scelto è un anello accent con un punto (una forma, non solo il colore); in `rows` la riga scelta ha la spunta.',
      ],
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The rows of the settings panel: full-width rows with an icon. */
export const Righe: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <RadioGroup label="Tema" appearance="rows" defaultValue="system">
        <Radio value="system" icon={<AutoIcon />}>
          Automatico
        </Radio>
        <Radio value="light" icon={<SunIcon />}>
          Chiaro
        </Radio>
        <Radio value="dark" icon={<MoonIcon />}>
          Scuro
        </Radio>
      </RadioGroup>
    </div>
  ),
};
