import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flow } from '@slurp-ui/react';

const meta = {
  title: 'Fondamenta/Flow',
  component: Flow,
  tags: ['autodocs'],
  args: { direction: 'row', gap: 4, wrap: true },
  argTypes: {
    direction: { control: 'inline-radio', options: ['column', 'row'] },
    gap: { control: 'select', options: [1, 2, 3, 4, 5, 6, 8, 10] },
    align: { control: 'inline-radio', options: [undefined, 'start', 'center', 'end', 'stretch'] },
    justify: {
      control: 'inline-radio',
      options: [undefined, 'start', 'center', 'end', 'space-between'],
    },
  },
  render: (args) => (
    <Flow {...args}>
      {['Uno', 'Due', 'Tre', 'Quattro'].map((label) => (
        <div key={label} className="docs-box">
          {label}
        </div>
      ))}
    </Flow>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Solo disposizione: nessun ruolo. L’ordine di lettura e di Tab è l’ordine del DOM, anche quando `direction` lo cambia a schermo.',
        'Con `as` (`ul`, `nav`, `section`…) dai al gruppo la semantica che serve.',
      ],
    },
  },
} satisfies Meta<typeof Flow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Responsive: Story = {
  name: 'Colonna su telefono, riga sopra',
  args: { direction: { base: 'row', compact: 'column' }, gap: { base: 6, compact: 3 } },
};
