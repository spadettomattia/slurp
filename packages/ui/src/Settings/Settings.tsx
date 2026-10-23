import { AutoIcon, CloseIcon, GearIcon, MoonIcon, SunIcon } from '@slurp-ui/icons';
import { cx } from '@slurp-ui/utils';
import { useId, type ReactNode } from 'react';

import { Bloom } from '../Bloom/Bloom';
import { useColorScheme } from '../internal/context';
import { useThemeProps } from '../internal/styled';
import type { SlurpCss } from '../lib/css';
import type { ColorSchemeMode } from '../lib/theme';
import { Radio, RadioGroup } from '../Radio/Radio';

export interface SettingsLabels {
  /** Name of the button. */
  open: string;
  /** Name of the button while open. */
  close: string;
  /** Title of the panel. */
  title: string;
  theme: string;
  system: string;
  light: string;
  dark: string;
  language: string;
}

export const SETTINGS_LABELS: SettingsLabels = {
  open: 'Impostazioni',
  close: 'Chiudi impostazioni',
  title: 'Impostazioni',
  theme: 'Tema',
  system: 'Automatico',
  light: 'Chiaro',
  dark: 'Scuro',
  language: 'Lingua',
};

export interface SettingsLanguage {
  value: string;
  /** Written in itself ("Italiano", "English"). */
  label: string;
  /** BCP 47 tag of the label ("it", "en"). */
  lang: string;
}

export interface SettingsProps {
  /**
   * Languages: the Lingua choice appears only when they are given (the library has no i18n of its own: apply the
   * choice yourself).
   */
  languages?: SettingsLanguage[];
  language?: string;
  onLanguageChange?: (value: string) => void;
  /** More preferences (RadioGroup with `appearance="rows"`), or a short note. */
  children?: ReactNode;
  /** Panel width. Default 300. */
  width?: number;
  /** In the flow instead of fixed at the top right. */
  inline?: boolean;
  labels?: Partial<SettingsLabels>;
  className?: string;
  css?: SlurpCss;
}

/**
 * Site settings: a round button at the top right that grows into its own panel (Bloom) and shrinks back. Tema is
 * always there (Automatico / Chiaro / Scuro, through useColorScheme); Lingua only when `languages` is set.
 * Needs a SlurpProvider.
 */
export function Settings(props: SettingsProps) {
  const {
    languages,
    language,
    onLanguageChange,
    children,
    width = 300,
    inline = false,
    labels: labelsProp,
    className,
    css,
  } = useThemeProps('Settings', props);
  const labels = { ...SETTINGS_LABELS, ...labelsProp };
  const { mode, setMode } = useColorScheme();
  const titleId = useId();
  return (
    <div className={cx('slurp-settings', className)} data-inline={inline || undefined}>
      <Bloom
        trigger={<GearIcon size={22} />}
        openTrigger={<CloseIcon size={22} />}
        label={labels.open}
        closeLabel={labels.close}
        placement="bottom-end"
        width={width}
        css={css}
        partProps={{ panel: { 'aria-labelledby': titleId } }}
      >
        <h2 id={titleId} className="slurp-settings-title">
          {labels.title}
        </h2>
        <RadioGroup
          label={labels.theme}
          appearance="rows"
          value={mode}
          onValueChange={(v) => setMode(v as ColorSchemeMode)}
        >
          <Radio value="system" icon={<AutoIcon />}>
            {labels.system}
          </Radio>
          <Radio value="light" icon={<SunIcon />}>
            {labels.light}
          </Radio>
          <Radio value="dark" icon={<MoonIcon />}>
            {labels.dark}
          </Radio>
        </RadioGroup>
        {languages?.length ? (
          <RadioGroup
            label={labels.language}
            appearance="rows"
            value={language ?? null}
            onValueChange={onLanguageChange}
          >
            {languages.map((l) => (
              <Radio key={l.value} value={l.value} lang={l.lang}>
                {l.label}
              </Radio>
            ))}
          </RadioGroup>
        ) : null}
        {children}
      </Bloom>
    </div>
  );
}
