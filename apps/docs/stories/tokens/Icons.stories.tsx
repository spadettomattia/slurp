import type { Meta, StoryObj } from '@storybook/react-vite';
import * as icons from '@slurp-ui/react/icons';
import { Text } from '@slurp-ui/react';

const all = Object.entries(icons).filter(([name]) => /^[A-Z]\w*Icon$/.test(name)) as [
  string,
  typeof icons.CheckIcon,
][];

function Gallery() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 'var(--slurp-space-3)',
      }}
    >
      {all.map(([name, Icon]) => (
        <figure
          key={name}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: 'var(--slurp-space-2)',
            margin: 0,
            padding: 'var(--slurp-space-4) var(--slurp-space-2)',
            borderRadius: 'var(--slurp-radius-md)',
            background: 'var(--slurp-surface-2)',
          }}
        >
          <Icon size={24} />
          <Text as="figcaption" font="caption" muted>
            {name.replace(/Icon$/, '')}
          </Text>
        </figure>
      ))}
    </div>
  );
}

const meta = {
  title: 'Tokens/Icone',
  component: Gallery,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Gallery>;

export default meta;
export const Tutte: StoryObj<typeof meta> = {};
