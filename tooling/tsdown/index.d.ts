import type { UserConfig } from 'tsdown';

export interface LibraryOptions {
  /**
   * Prepend the "use client" directive to every emitted JS file (or to those the predicate accepts),
   * so the components work from React Server Components without the consumer wrapping them.
   */
  useClient?: boolean | ((fileName: string) => boolean);
}

export declare function libraryConfig(options?: LibraryOptions & UserConfig): UserConfig;
