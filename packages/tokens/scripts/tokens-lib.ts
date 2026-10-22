// Turns the Slurp design-system export (src/tokens.json) into CSS custom properties and typed TS constants.
// Pure functions only: scripts/generate.ts does the file I/O, test/ checks the output.

export const PREFIX = 'slurp';

type Themed = string | { light: string; dark: string };

interface ValueToken {
  name: string;
  value: Themed;
  usage: string;
}

interface TypeStyle {
  name: string;
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: string;
  sample: string;
  usage: string;
}

export interface SlurpTokensSource {
  name: string;
  version: number;
  meta: { synced: string };
  color: { themes: { id: string; name: string }[]; tokens: ValueToken[] };
  type: {
    fonts: { family: string; file: string; weight: string; style: string }[];
    families: Record<string, string>;
    groups: { name: string; family: string; styles: TypeStyle[] }[];
  };
  spacing: { tokens: ValueToken[] };
  radius: { tokens: ValueToken[] };
  shadow: { tokens: ValueToken[] };
  blur: { tokens: ValueToken[] };
  opacity: { tokens: ValueToken[] };
}

/** One CSS custom property: `--slurp-<name>`. `dark` is set only when it differs per theme. */
export interface CssEntry {
  name: string;
  light: string;
  dark?: string;
  usage: string;
}

export interface FontStyle {
  family: string;
  fontSize: string;
  compactFontSize?: string;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: string;
}

export interface Model {
  meta: { name: string; version: number; synced: string };
  entries: CssEntry[];
  /** Entries whose value is a `{token}` reference: emitted as `var(--slurp-token)`. */
  aliases: Map<string, string>;
  fonts: Record<string, FontStyle>;
  families: Record<string, string>;
  fontFaces: { family: string; file: string; weight: string; style: string }[];
  compactQuery: string;
}

const REF = /^\{([a-z0-9-]+)\}$/;
// Phone sizes live in the usage text of the source ("34px below 640px"); there is no structured field for them.
const COMPACT = /(\d+(?:\.\d+)?px) below (\d+)px/;

export const varName = (name: string): string => `--${PREFIX}-${name}`;

export function buildModel(src: SlurpTokensSource): Model {
  const entries: CssEntry[] = [];
  const aliases = new Map<string, string>();
  const seen = new Set<string>();

  const add = (entry: CssEntry) => {
    if (seen.has(entry.name)) throw new Error(`Duplicate token "${entry.name}"`);
    seen.add(entry.name);
    entries.push(entry);
  };

  const groups = [
    src.color.tokens,
    src.spacing.tokens,
    src.radius.tokens,
    src.shadow.tokens,
    src.blur.tokens,
    src.opacity.tokens,
  ];
  for (const token of groups.flat()) {
    if (typeof token.value === 'string') {
      const target = REF.exec(token.value)?.[1];
      if (target) aliases.set(token.name, target);
      add({ name: token.name, light: token.value, usage: token.usage });
    } else {
      const { light, dark } = token.value;
      add({ name: token.name, light, ...(dark !== light && { dark }), usage: token.usage });
    }
  }

  for (const [alias, target] of aliases) {
    if (!seen.has(target)) throw new Error(`Token "${alias}" references unknown token "${target}"`);
    if (aliases.has(target))
      throw new Error(`Token "${alias}" references another alias "${target}"`);
  }

  const fonts: Record<string, FontStyle> = {};
  let compactWidth: string | undefined;
  for (const group of src.type.groups) {
    if (!(group.family in src.type.families)) {
      throw new Error(`Type group "${group.name}" uses unknown family "${group.family}"`);
    }
    for (const style of group.styles) {
      const compact = COMPACT.exec(style.usage);
      if (compact) {
        if (compactWidth && compactWidth !== compact[2]) {
          throw new Error(
            `Inconsistent compact breakpoint in "${style.name}": ${compact[2]}px vs ${compactWidth}px`,
          );
        }
        compactWidth = compact[2];
      }
      fonts[style.name] = {
        family: group.family,
        fontSize: style.fontSize,
        ...(compact && { compactFontSize: compact[1] }),
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
        ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
      };
    }
  }
  if (!compactWidth) throw new Error('No compact breakpoint found in the type styles');

  return {
    meta: { name: src.name, version: src.version, synced: src.meta.synced },
    entries,
    aliases,
    fonts,
    families: src.type.families,
    fontFaces: src.type.fonts,
    compactQuery: `(max-width: ${compactWidth}px)`,
  };
}

/** Resolves `{token}` references to the referenced value, per theme. */
export function resolve(model: Model, name: string): { light: string; dark?: string } {
  const entry = model.entries.find((e) => e.name === name);
  if (!entry) throw new Error(`Unknown token "${name}"`);
  const target = model.aliases.get(name);
  if (target) return resolve(model, target);
  return entry.dark === undefined
    ? { light: entry.light }
    : { light: entry.light, dark: entry.dark };
}

const isThemed = (model: Model, entry: CssEntry): boolean =>
  entry.dark !== undefined ||
  (model.aliases.has(entry.name) && resolve(model, entry.name).dark !== undefined);

const cssValue = (model: Model, entry: CssEntry, theme: 'light' | 'dark'): string => {
  const target = model.aliases.get(entry.name);
  if (target) return `var(${varName(target)})`;
  return theme === 'dark' ? (entry.dark ?? entry.light) : entry.light;
};

/** Every font custom property, in emission order: family vars, then per style size/line-height/weight/tracking + shorthand. */
export function fontVars(model: Model): [name: string, value: string][] {
  const out: [string, string][] = [];
  for (const [family, stack] of Object.entries(model.families))
    out.push([`font-family-${family}`, stack]);
  for (const [name, style] of Object.entries(model.fonts)) {
    const base = `font-${name}`;
    out.push(
      [`${base}-size`, style.fontSize],
      [`${base}-line-height`, String(style.lineHeight)],
      [`${base}-weight`, String(style.fontWeight)],
      [`${base}-tracking`, style.letterSpacing ?? 'normal'],
      [
        base,
        `var(${varName(`${base}-weight`)}) var(${varName(`${base}-size`)}) / var(${varName(`${base}-line-height`)}) var(${varName(`font-family-${style.family}`)})`,
      ],
    );
  }
  return out;
}

const decl = (name: string, value: string) => `    ${varName(name)}: ${value};`;

export function buildCss(model: Model): string {
  const fixed = model.entries.filter((e) => !isThemed(model, e));
  const themed = model.entries.filter((e) => isThemed(model, e));
  const themeBlock = (theme: 'light' | 'dark') =>
    [
      `    color-scheme: ${theme};`,
      ...themed.map((e) => decl(e.name, cssValue(model, e, theme))),
    ].join('\n');

  const compact = Object.entries(model.fonts).flatMap(([name, s]) =>
    s.compactFontSize ? [decl(`font-${name}-size`, s.compactFontSize)] : [],
  );

  return `/* @slurp/tokens — generated from src/tokens.json (${model.meta.name} v${model.meta.version}, synced ${model.meta.synced}). Do not edit. */
@layer slurp.reset, slurp.base, slurp.components, slurp.utilities;

@layer slurp.base {
  :where(:root) {
${[...fixed.map((e) => decl(e.name, cssValue(model, e, 'light'))), ...fontVars(model).map(([n, v]) => decl(n, v))].join('\n')}
  }

  /* Themed tokens. data-theme always wins over the system setting, on the root or on any subtree.
     Every selector is wrapped in :where() (zero specificity): theme overrides and AccentScope win whatever
     the stylesheet order, and between these blocks only their order decides. */
  :where(:root, [data-theme='light']) {
${themeBlock('light')}
  }

  :where([data-theme='dark']) {
${themeBlock('dark')}
  }

  @media (prefers-color-scheme: dark) {
    :where(:root:not([data-theme='light'])) {
${themeBlock('dark').replace(/^ {4}/gm, '      ')}
    }
  }

  /* Compact (phone) type scale. */
  @media ${model.compactQuery} {
    :where(:root) {
${compact.join('\n').replace(/^ {4}/gm, '      ')}
    }
  }
}
`;
}

export function buildFontsCss(model: Model): string {
  const faces = model.fontFaces.map(
    (f) => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('./${f.file}') format('woff2');
}`,
  );
  return `/* @slurp/tokens — generated from src/tokens.json. Do not edit. */\n${faces.join('\n\n')}\n`;
}

const literal = (value: unknown): string => JSON.stringify(value, null, 2);

/** Short key inside a group: `space-4` → `4`, `radius-card` → `card`, `hue-violet` → `violet`. */
const shortKey = (name: string, prefix: string) =>
  name.startsWith(`${prefix}-`) ? name.slice(prefix.length + 1) : name;

export function buildTs(model: Model, src: SlurpTokensSource): string {
  const value = (name: string) => {
    const v = resolve(model, name);
    return v.dark === undefined ? v.light : { light: v.light, dark: v.dark };
  };
  const group = (
    tokens: ValueToken[],
    prefix: string,
    filter: (n: string) => boolean = () => true,
  ) =>
    Object.fromEntries(
      tokens.filter((t) => filter(t.name)).map((t) => [shortKey(t.name, prefix), value(t.name)]),
    );

  const isHue = (n: string) => n.startsWith('hue-');
  const names = [...model.entries.map((e) => e.name), ...fontVars(model).map(([n]) => n)];
  const usage = Object.fromEntries(model.entries.map((e) => [e.name, e.usage]));
  for (const group of src.type.groups)
    for (const s of group.styles) usage[`font-${s.name}`] = s.usage;

  return `// @slurp/tokens — generated from src/tokens.json (${model.meta.name} v${model.meta.version}). Do not edit.

export const meta = ${literal(model.meta)} as const;

export const themes = ${literal(src.color.themes.map((t) => t.id))} as const;

/** Semantic colours (light/dark when they differ). \`accent\`, \`on-accent\`, \`accent-soft\`, \`accent-ink\` are defaults: AccentScope recomputes them at runtime. */
export const color = ${literal(group(src.color.tokens, 'color', (n) => !isHue(n)))} as const;

/** Accent presets. */
export const hue = ${literal(group(src.color.tokens, 'hue', isHue))} as const;

export const space = ${literal(group(src.spacing.tokens, 'space'))} as const;

export const radius = ${literal(group(src.radius.tokens, 'radius'))} as const;

export const shadow = ${literal(group(src.shadow.tokens, 'shadow'))} as const;

export const blur = ${literal(group(src.blur.tokens, 'blur'))} as const;

export const opacity = ${literal(group(src.opacity.tokens, 'opacity'))} as const;

export const fontFamily = ${literal(model.families)} as const;

export const font = ${literal(model.fonts)} as const;

export const fontFaces = ${literal(model.fontFaces)} as const;

/** Media query of the compact (phone) layout. */
export const COMPACT_QUERY = ${literal(model.compactQuery)};

/** Every custom property declared by tokens.css, by token name (without the \`--${PREFIX}-\` prefix). */
export const vars = ${literal(Object.fromEntries(names.map((n) => [n, varName(n)])))} as const;

export type TokenName = keyof typeof vars;
export type ThemeName = (typeof themes)[number];
export type ColorToken = keyof typeof color;
export type HueToken = keyof typeof hue;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
export type FontToken = keyof typeof font;

/** Usage notes from the design system, by token name. */
export const usage: Partial<Record<TokenName, string>> = ${literal(usage)};
`;
}
