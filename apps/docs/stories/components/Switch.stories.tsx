import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { children: 'Notifiche', defaultChecked: true },
  parameters: {
    slurp: {
      a11y: [
        'Un checkbox nativo con `role="switch"`: annunciato come “attivato” / “disattivato”, Spazio lo cambia.',
        'Per impostazioni che valgono subito; in un form da inviare preferisci `Checkbox`.',
        'Acceso = cursore in fondo con la spunta e traccia accent, non solo il colore.',
      ],
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
