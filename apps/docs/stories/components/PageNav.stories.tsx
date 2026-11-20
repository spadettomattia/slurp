import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageNav } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/PageNav',
  component: PageNav,
  tags: ['autodocs'],
  args: {
    previous: { title: 'Installazione', href: '#installazione' },
    next: { title: 'Tema e colori', href: '#tema' },
  },
  parameters: {
    slurp: {
      a11y: [
        'Una `nav` con nome; ogni link dice direzione e titolo della pagina.',
        '`linkAs` usa il link del tuo router (che riceve `to` o `href`).',
      ],
    },
  },
} satisfies Meta<typeof PageNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SoloSuccessiva: Story = {
  name: 'Solo successiva',
  args: { previous: undefined },
};
