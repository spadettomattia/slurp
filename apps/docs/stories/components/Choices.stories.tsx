import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Chip, Count, Flow, Segmented, SwatchGroup, Text } from '@slurp-ui/react';
import { useState } from 'react';

const meta = {
  title: 'Componenti/Scelte',
  component: Segmented,
  tags: ['autodocs'],
  args: {
    label: 'Vista',
    options: [
      { value: 'grid', label: 'Griglia' },
      { value: 'list', label: 'Lista' },
      { value: 'map', label: 'Mappa' },
    ],
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SegmentedPlayground: Story = { name: 'Segmented' };

function ChipsDemo() {
  const [on, setOn] = useState(['Usato']);
  const toggle = (name: string) =>
    setOn((all) => (all.includes(name) ? all.filter((x) => x !== name) : [...all, name]));
  return (
    <Flow gap={3}>
      <Flow direction="row" gap={2} wrap>
        {['Nuovo', 'Usato', 'Ricondizionato', 'In offerta'].map((name) => (
          <Chip key={name} selected={on.includes(name)} onSelectedChange={() => toggle(name)}>
            {name}
          </Chip>
        ))}
      </Flow>
      <Text font="caption" muted>
        Selezionato = riempimento accent più il segno di spunta.
      </Text>
    </Flow>
  );
}

export const Chips: Story = { render: () => <ChipsDemo /> };

export const Colori: Story = {
  render: () => (
    <SwatchGroup
      label="Colore"
      defaultValue="night"
      options={[
        { value: 'night', color: '#1f2a44', label: 'Blu notte' },
        { value: 'sand', color: '#d9c7a7', label: 'Sabbia' },
        { value: 'sage', color: '#9bb59a', label: 'Salvia' },
        { value: 'coral', color: '#f0745f', label: 'Corallo' },
      ]}
    />
  ),
};

export const ConteggiEAvatar: Story = {
  name: 'Count e Avatar',
  render: () => (
    <Flow direction="row" gap={5} wrap align="center">
      <Count value={3} label={(n) => `${n} filtri attivi`} />
      <Count value={128} tone="neutral" />
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" size="lg" />
    </Flow>
  ),
};
