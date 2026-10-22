import type { Meta, StoryObj } from '@storybook/react-vite';
import { createTheme, Flow, SlurpProvider, Surface, Text, useColorScheme } from '@slurp/ui';
import type { CSSProperties } from 'react';

const meta = {
  title: 'Sistema/Personalizzazione',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Card({ title, children }: { title: string; children: string }) {
  return (
    <Surface css={{ p: 5 }}>
      <Flow gap={1}>
        <Text font="title-s">{title}</Text>
        <Text font="body-s" muted>
          {children}
        </Text>
      </Flow>
    </Surface>
  );
}

const custom = createTheme({
  accent: '#0a84ff',
  tokens: { radius: { card: 16 } },
  components: {
    Text: { css: { root: { '&[data-font="title-s"]': { color: 'accent-ink' } } } },
  },
});

/** 1 · Theme: accent from any colour (vivid), token overrides, per-component css. */
export const Tema: Story = {
  render: () => (
    <SlurpProvider theme={custom} storageKey={null}>
      <Flow gap={4}>
        <Text font="eyebrow">createTheme</Text>
        <Card title="Accento #0a84ff → vivid()">
          radius.card 16 e titoli in accent-ink da theme.components.Text.css
        </Card>
      </Flow>
    </SlurpProvider>
  ),
};

/** 2 · The css prop: tokens, pseudo selectors, breakpoints. */
export const PropCss: Story = {
  name: 'Prop css',
  render: () => (
    <Surface
      css={{
        p: { base: 8, compact: 4 },
        radius: 'panel',
        '&:hover': { bg: 'surface-dock' },
        '& .slurp-text': { textAlign: 'center' },
      }}
    >
      <Text font="title-l">
        css=&#123;&#123; p: &#123; base: 8, compact: 4 &#125;, radius: &apos;panel&apos;
        &#125;&#125;
      </Text>
      <Text muted>Hover: surface-dock. Testo centrato con un selettore annidato.</Text>
    </Surface>
  ),
};

/** 3 · Local CSS variables: inline override, no runtime. */
export const VariabiliCss: Story = {
  name: 'Variabili CSS',
  render: () => (
    <Flow style={{ '--slurp-flow-gap': '40px' } as CSSProperties} direction="row" wrap>
      <Surface style={{ '--slurp-surface-radius': '8px' } as CSSProperties} css={{ p: 5 }}>
        <Text>--slurp-surface-radius: 8px</Text>
      </Surface>
      <Surface css={{ p: 5 }}>
        <Text>--slurp-flow-gap: 40px tra le due</Text>
      </Surface>
    </Flow>
  ),
};

function SchemeReadout() {
  const { mode, resolved } = useColorScheme();
  return (
    <Text font="body-s">
      mode: <strong>{mode}</strong> · resolved: <strong>{resolved}</strong>
    </Text>
  );
}

/** useColorScheme() reads the toolbar choice through the provider of the decorator. */
export const SchemaColori: Story = {
  name: 'useColorScheme',
  render: () => (
    <Surface css={{ p: 5 }}>
      <SchemeReadout />
    </Surface>
  ),
};
