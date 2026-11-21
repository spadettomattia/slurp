import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, FocusTrap, Surface } from '@slurp-ui/react';
import { useState } from 'react';

function Demo() {
  const [on, setOn] = useState(false);
  return (
    <div>
      <Button onClick={() => setOn(true)}>Apri il pannello</Button>
      {on && (
        <FocusTrap onEscape={() => setOn(false)}>
          <Surface style={{ padding: 20, marginTop: 12, display: 'flex', gap: 8 }}>
            <Button appearance="soft">Uno</Button>
            <Button appearance="soft">Due</Button>
            <Button onClick={() => setOn(false)}>Chiudi</Button>
          </Surface>
        </FocusTrap>
      )}
    </div>
  );
}

const meta = {
  title: 'Componenti/FocusTrap',
  component: FocusTrap,
  tags: ['autodocs'],
  render: () => <Demo />,
  parameters: {
    slurp: {
      a11y: [
        'Tab e Maiusc+Tab restano dentro: dall’ultimo controllo si va al primo e viceversa.',
        'All’attivazione il focus entra (prima `data-autofocus`, poi la scelta attiva, poi il primo controllo); alla chiusura torna dov’era.',
        'Per un `<dialog>` modale nativo non serve: contiene già il focus.',
      ],
    },
  },
} satisfies Meta<typeof FocusTrap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
