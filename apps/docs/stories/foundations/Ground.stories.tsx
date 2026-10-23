import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Flow, Ground, Text } from '@slurp-ui/react';

const meta = {
  title: 'Fondamenta/Ground',
  component: Ground,
  tags: ['autodocs'],
  render: () => (
    <Flow gap={3}>
      <Text>
        Questa pagina usa già <code>{'<Ground />'}</code>: sfondo tinto dall’accento, testo in
        Poppins, anello di focus visibile. Premi Tab per vederlo.
      </Text>
      <Flow direction="row" gap={3}>
        <Button>Primo</Button>
        <Button appearance="outline" tone="neutral">
          Secondo
        </Button>
      </Flow>
    </Flow>
  ),
  parameters: {
    slurp: {
      a11y: [
        'Mettilo una volta in cima all’app (come un reset): non rende elementi, solo un `<style>`.',
        'Dà un anello di focus visibile da 2px a tutto ciò che riceve il focus da tastiera.',
        'Lo sfondo è `bg` tinto al 7% dall’accento: i contrasti del testo restano quelli dei token.',
      ],
    },
  },
} satisfies Meta<typeof Ground>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Page baseline: border-box, no body margin, Poppins, the tinted ground, a visible focus ring. */
export const Playground: Story = {};
