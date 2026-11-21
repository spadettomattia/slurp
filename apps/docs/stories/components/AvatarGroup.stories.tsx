import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarGroup } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  args: {
    label: 'Partecipanti',
    max: 4,
    people: [
      'Anna Rossi',
      'Luca Bianchi',
      'Sara Verdi',
      'Marco Neri',
      'Elena Gialli',
      'Paolo Blu',
    ].map((name) => ({ name })),
  },
  parameters: {
    slurp: {
      a11y: [
        'Un gruppo con nome; ogni avatar porta il nome della persona e il contatore dice “altre N persone”.',
      ],
    },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
