import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Rating',
  component: Rating,
  tags: ['autodocs'],
  args: { label: 'Il tuo voto', defaultValue: 3 },
  parameters: {
    slurp: {
      a11y: [
        'Come input è un `fieldset` con la legenda visibile e un radio nativo per stella (“3 stelle”): frecce per muoversi e scegliere.',
        'Le stelle scelte sono piene (accent-ink), le altre solo contorno (border-control, 3:1): forma, non solo colore. Ogni stella è un bersaglio di 44px.',
        'In sola lettura è un’unica immagine con il valore a parole (“Valutazione media: 4.5 su 5”).',
      ],
    },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Showing a value, fractional too. */
export const ReadOnly: Story = { args: { label: 'Valutazione media', value: 4.5, readOnly: true } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Rating {...args} label="Piccola" size="sm" readOnly value={3.5} />
      <Rating {...args} label="Media" size="md" readOnly value={3.5} />
      <Rating {...args} label="Grande" size="lg" readOnly value={3.5} />
    </div>
  ),
};
