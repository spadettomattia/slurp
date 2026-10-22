// Shared tsdown config for the publishable @slurp-ui/* packages.
// ESM-only, one output file per source module (deep imports + tree-shaking), .d.ts next to each file.

/**
 * @typedef {import('tsdown').UserConfig} UserConfig
 * @typedef {object} LibraryOptions
 * @property {boolean | ((fileName: string) => boolean)} [useClient]
 *   Prepend the "use client" directive to every emitted JS file (or to those the predicate accepts),
 *   so the components work from React Server Components without the consumer wrapping them.
 */

/**
 * @param {LibraryOptions & UserConfig} [options]
 * @returns {UserConfig}
 */
export function libraryConfig({ useClient = false, ...overrides } = {}) {
  const wantsDirective = typeof useClient === 'function' ? useClient : () => useClient;
  return {
    entry: ['src/index.ts'],
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    unbundle: true,
    dts: true,
    sourcemap: true,
    clean: true,
    banner: ({ fileName }) =>
      fileName.endsWith('.js') && wantsDirective(fileName) ? { js: '"use client";' } : undefined,
    ...overrides,
  };
}
