// Which pages exist, per language: `it/components/button` for content/it/components/button.mdx.
const files = import.meta.glob('../content/*/**/*.mdx');

export const AVAILABLE: Set<string> = new Set(
  Object.keys(files).map((f) => f.replace(/^\.\.\/content\//, '').replace(/\.mdx$/, '')),
);
