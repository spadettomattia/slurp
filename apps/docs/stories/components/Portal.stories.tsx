import type { Meta, StoryObj } from '@storybook/react-vite';
import { Portal, Surface, Text } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Portal',
  component: Portal,
  tags: ['autodocs'],
  render: () => (
    <>
      <Text>Il riquadro qui sotto è reso in fondo a document.body.</Text>
      <Portal>
        <Surface
          role="note"
          aria-label="Reso altrove"
          css={{ position: 'fixed', right: 24, bottom: 24, p: 4 }}
        >
          <Text font="label">Sono in un portale</Text>
        </Surface>
      </Portal>
    </>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Sposta i nodi nel DOM, non l’ordine logico: chi apre un pannello in un portale deve gestire il focus (lo fanno già `Dialog`, `Sheet` e `Toast`).',
        'Nel rendering lato server non rende nulla: il contenuto compare dopo l’idratazione.',
      ],
    },
  },
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
