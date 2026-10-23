import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bubble, Hint } from '@slurp-ui/react';
import { GearIcon } from '@slurp-ui/react/icons';

const meta = {
  title: 'Componenti/Hint',
  component: Hint,
  tags: ['autodocs'],
  args: {
    content: 'Impostazioni',
    children: (
      <Bubble label="Impostazioni">
        <GearIcon />
      </Bubble>
    ),
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ paddingTop: 64 }}>
      <Hint {...args} />
    </div>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Compare al passaggio (dopo `delay`) e subito al focus; è collegato al trigger con `aria-describedby`.',
        'Escape lo chiude; resta visibile mentre il puntatore ci passa sopra (WCAG 1.4.13).',
        'Il testo non deve essere essenziale: il trigger ha già il suo nome (per un `Bubble`, `label`).',
      ],
    },
  },
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
