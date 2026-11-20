import type { Meta, StoryObj } from '@storybook/react-vite';
import { Prose } from '@slurp-ui/react';

const meta = {
  title: 'Componenti/Prose',
  component: Prose,
  tags: ['autodocs'],
  args: { size: 'md' },
  parameters: {
    slurp: {
      a11y: [
        'Lascia intatta la struttura: i titoli restano titoli, le liste liste, le citazioni citazioni.',
        'Misura di lettura di circa 70 caratteri; link sottolineati e in accent-ink, riconoscibili senza colore.',
      ],
    },
  },
  render: (args) => (
    <Prose {...args} as="article">
      <h1>Primi passi</h1>
      <p>Il testo lungo, da Markdown o da un CMS, prende titoli, liste e citazioni dal sistema.</p>
      <h2>Come funziona</h2>
      <p>
        Ogni elemento usa la scala tipografica: <strong>nessuna classe</strong> da scrivere a mano,
        un <a href="#link">link</a> resta riconoscibile e il <code>codice</code> in linea ha il suo
        fondo.
      </p>
      <ul>
        <li>Titoli e paragrafi con la spaziatura del sistema</li>
        <li>Liste con i segni attenuati</li>
      </ul>
      <blockquote>
        <p>Una citazione, distinta dal resto del testo.</p>
      </blockquote>
      <h3>Una tabella</h3>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valore</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primo</td>
            <td>Uno</td>
          </tr>
          <tr>
            <td>Secondo</td>
            <td>Due</td>
          </tr>
        </tbody>
      </table>
    </Prose>
  ),
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
