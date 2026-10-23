import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, Flow } from '@slurp-ui/react';
import { useState } from 'react';

const meta = {
  title: 'Componenti/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Usato', defaultSelected: true },
  parameters: {
    slurp: {
      a11y: [
        'Un `<button>` con `aria-pressed`: i lettori di schermo annunciano “premuto” / “non premuto”.',
        'Selezionato = riempimento accent **più** il segno di spunta: lo stato non è affidato al solo colore.',
        'In un gruppo di filtri, dai un nome al gruppo (per esempio con `Filters.Group`).',
      ],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function FiltersDemo() {
  const [on, setOn] = useState(['Usato']);
  const toggle = (name: string) =>
    setOn((all) => (all.includes(name) ? all.filter((x) => x !== name) : [...all, name]));
  return (
    <Flow direction="row" gap={2} wrap role="group" aria-label="Condizione">
      {['Nuovo', 'Usato', 'Ricondizionato', 'In offerta'].map((name) => (
        <Chip key={name} selected={on.includes(name)} onSelectedChange={() => toggle(name)}>
          {name}
        </Chip>
      ))}
    </Flow>
  );
}

export const Gruppo: Story = { name: 'Gruppo di filtri', render: () => <FiltersDemo /> };
