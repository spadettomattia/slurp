import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Text } from '@slurp-ui/react';

const meta = {
  title: 'Firma/Settings',
  component: Settings,
  tags: ['autodocs'],
  args: {
    inline: true,
    languages: [
      { value: 'it', label: 'Italiano', lang: 'it' },
      { value: 'en', label: 'English', lang: 'en' },
    ],
    language: 'it',
  },
  render: (args) => (
    <div style={{ minHeight: 420 }}>
      <Settings {...args}>
        <Text font="caption" muted>
          Le schede prodotto restano in italiano.
        </Text>
      </Settings>
    </div>
  ),
  parameters: {
    slurp: {
      anatomy: ['Settings', 'Bloom'],
      a11y: [
        'Un bottone tondo con nome (`labels.open`, da aperto `labels.close`) che diventa il pannello: valgono le regole di `Bloom` (focus nel pannello, Escape lo riporta sul bottone).',
        'Tema e Lingua sono gruppi di radio con nome, a righe con icona e spunta.',
        'Ogni lingua è scritta in sé stessa e ha il suo `lang`, così il lettore di schermo la pronuncia bene.',
      ],
    },
  },
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tema is always there (through useColorScheme); Lingua only when `languages` are given. */
export const Playground: Story = {};
