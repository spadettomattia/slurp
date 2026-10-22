import type { Meta, StoryObj } from '@storybook/react-vite';

import source from '@slurp/tokens/tokens.json';
import { cssVar, font, fontFamily, type TokenName } from '@slurp/ui/tokens';

import { TokenPage, Usage } from './TokenPage';

const meta = {
  title: 'Tokens/Tipografia',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample copy of each style, straight from the design-system export.
const samples = Object.fromEntries(
  source.type.groups.flatMap((group) => group.styles.map((style) => [style.name, style.sample])),
) as Record<string, string>;

export const Scala: Story = {
  render: () => (
    <TokenPage
      title="Tipografia"
      lead={`Poppins 400–700 per tutto (${fontFamily.sans}). Sotto i 640px i titoli display si riducono da soli.`}
    >
      {Object.entries(font).map(([key, style]) => {
        const name = `font-${key}` as TokenName;
        return (
          <section key={key} className="docs-type" aria-label={key}>
            <span className="docs-muted docs-code">
              {key} · {style.fontSize}
              {'compactFontSize' in style ? ` (telefono ${style.compactFontSize})` : ''} /{' '}
              {style.lineHeight} · {style.fontWeight}
            </span>
            <span
              style={{
                font: cssVar(name),
                letterSpacing: cssVar(`${name}-tracking` as TokenName),
                textTransform: key === 'eyebrow' ? 'uppercase' : undefined,
                color: key === 'eyebrow' || key === 'caption' ? cssVar('muted') : undefined,
              }}
            >
              {samples[key]}
            </span>
            <Usage name={name} />
          </section>
        );
      })}
    </TokenPage>
  ),
};
