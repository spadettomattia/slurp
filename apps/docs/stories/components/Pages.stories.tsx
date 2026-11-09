import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pages } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Pages',
  component: Pages,
  tags: ['autodocs'],
  args: { count: 12, defaultPage: 5 },
  argTypes: { href: { control: false } },
  parameters: {
    slurp: {
      a11y: [
        'Un landmark `navigation` (“Pagine”); la pagina corrente ha `aria-current="page"` ed è un disco pieno, non solo un colore.',
        'Ogni numero ha un nome completo (“Pagina 3”); precedente e successiva si disattivano agli estremi. I “…” sono decorativi.',
        'Sul telefono restano precedente, “3 di 12” e successiva. Con `href` ogni voce è un vero link.',
      ],
    },
  },
} satisfies Meta<typeof Pages>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Two pages on each side of the current one and two at each end. */
export const Wider: Story = { args: { count: 40, defaultPage: 20, siblings: 2, boundaries: 2 } };

/** Real links: crawlable, they open in a new tab. */
export const Links: Story = { args: { href: (page: number) => `?pagina=${page}` } };
