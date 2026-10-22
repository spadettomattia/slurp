import type { Meta, StoryObj } from '@storybook/react-vite';

import { blur, cssVar, opacity, radius, shadow, space, type TokenName } from '@slurp/ui/tokens';

import { formatValue, TokenPage, Usage, VarName } from './TokenPage';

const meta = {
  title: 'Tokens/Spazi e forme',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spazi: Story = {
  render: () => (
    <TokenPage
      title="Spazi"
      lead="Scala da space-1 a space-10, più space-48 sotto le pagine con il Dock."
    >
      <ul className="docs-rows">
        {Object.entries(space).map(([key, value]) => {
          const name = `space-${key}` as TokenName;
          return (
            <li key={name} className="docs-row">
              <span className="docs-code">{value}</span>
              <div>
                <strong>{name}</strong>
                <br />
                <VarName name={name} />
                <div
                  className="docs-bar"
                  style={{ width: cssVar(name), marginTop: cssVar('space-2') }}
                  aria-hidden="true"
                />
              </div>
              <Usage name={name} />
            </li>
          );
        })}
      </ul>
    </TokenPage>
  ),
};

export const Raggi: Story = {
  render: () => (
    <TokenPage
      title="Raggi"
      lead="I raggi crescono con il contenitore; i controlli usano radius-full."
    >
      <ul className="docs-grid docs-rows">
        {Object.entries(radius).map(([key, value]) => {
          const name = `radius-${key}` as TokenName;
          return (
            <li key={name} className="docs-hue">
              <span className="docs-radius" style={{ borderRadius: cssVar(name), width: '100%' }}>
                <span className="docs-code">{value}</span>
              </span>
              <strong>{name}</strong>
              <Usage name={name} />
            </li>
          );
        })}
      </ul>
    </TokenPage>
  ),
};

export const Profondita: Story = {
  name: 'Ombre, sfocature, opacità',
  render: () => (
    <TokenPage
      title="Ombre, sfocature, opacità"
      lead="Una sola ombra, shadow-float, per ogni superficie fluttuante."
    >
      <div className="docs-float">
        <strong>surface + shadow-float + blur-surface</strong>
        <p className="docs-muted docs-code">{formatValue(shadow.float)}</p>
      </div>
      <h2>Valori</h2>
      <ul className="docs-rows">
        {[
          ...Object.entries(blur).map(([key, value]) => [`blur-${key}`, value] as const),
          ...Object.entries(opacity).map(([key, value]) => [key, value] as const),
        ].map(([key, value]) => {
          const name = key as TokenName;
          return (
            <li key={name} className="docs-row">
              <span className="docs-code">{value}</span>
              <div>
                <strong>{name}</strong>
                <br />
                <VarName name={name} />
              </div>
              <Usage name={name} />
            </li>
          );
        })}
      </ul>
    </TokenPage>
  ),
};
