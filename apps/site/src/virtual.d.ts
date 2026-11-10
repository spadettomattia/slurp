declare module 'virtual:slurp-api' {
  import type { ApiComponent } from '../plugins/api';
  const api: ApiComponent[];
  export default api;
  /** Highlighted import lines per module. */
  export const imports: Record<string, string>;
}

declare module 'virtual:slurp-api-index' {
  const index: { name: string; module: string; summary: string }[];
  export default index;
}

declare module '*?demo' {
  import type { ComponentType } from 'react';
  const Demo: ComponentType<{ open?: boolean; align?: 'center' | 'stretch' }>;
  export default Demo;
}

declare module 'virtual:slurp-anatomy' {
  import type { ComponentAnatomy } from '../../docs/.storybook/anatomy';
  const anatomy: Record<string, ComponentAnatomy>;
  export default anatomy;
}
