import type { Meta, StoryObj } from '@storybook/react-vite';

import { color, cssVar, hue, type TokenName } from '@slurp/ui/tokens';

import { formatValue, TokenPage, Usage, VarName } from './TokenPage';

const meta = {
  title: 'Tokens/Colori',
  tags: ['autodocs'],
  parameters: { slurp: { bare: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Semantici: Story = {
  render: () => (
    <TokenPage
      title="Colori semantici"
      lead="Fondi, testo, confini, accento e stati. Cambia tema dalla toolbar: i valori seguono data-theme o, senza scelta, prefers-color-scheme."
    >
      <ul className="docs-rows">
        {Object.entries(color).map(([key, value]) => {
          const name = key as TokenName;
          return (
            <li key={name} className="docs-row">
              <span
                className="docs-swatch"
                style={{ background: cssVar(name) }}
                aria-hidden="true"
              />
              <div>
                <strong>{name}</strong>
                <br />
                <VarName name={name} />
                <p className="docs-muted docs-code">{formatValue(value)}</p>
              </div>
              <Usage name={name} />
            </li>
          );
        })}
      </ul>
    </TokenPage>
  ),
};

export const Tinte: Story = {
  render: () => (
    <TokenPage
      title="Tinte d'accento"
      lead="Preset pronti per l'accento dinamico. Il testo sulla tinta usa on-accent: almeno 4,5:1 su ogni preset."
    >
      <ul className="docs-grid docs-rows">
        {Object.entries(hue).map(([key, value]) => {
          const name = `hue-${key}` as TokenName;
          return (
            <li key={name} className="docs-hue">
              <span className="docs-hue-fill" style={{ background: cssVar(name) }}>
                Aa
              </span>
              <strong>{name}</strong>
              <span className="docs-muted docs-code">{value}</span>
            </li>
          );
        })}
      </ul>
    </TokenPage>
  ),
};
