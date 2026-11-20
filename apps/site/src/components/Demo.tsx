import { Code, Surface } from '@slurp-ui/react';
import type { ReactNode } from 'react';

import { useLang } from '~/lib/lang';

export interface DemoProps {
  /** The live example. */
  children: ReactNode;
  /** Its source, as shown, and highlighted. */
  code: string;
  html: string;
  /** Centres the example (default) or lets it fill the width. */
  align?: 'center' | 'stretch';
}

/** The highlighted lines without shiki's own <pre><code> wrapper (Code renders those). */
const inner = (html: string) =>
  html.replace(/^\s*<pre[^>]*>\s*<code[^>]*>/, '').replace(/<\/code>\s*<\/pre>\s*$/, '');

/**
 * A live example with the code that renders it right below, always visible (the tailwindcss.com way), on one
 * translucent Surface: the example on its stage, then the library's Code with its copy button.
 */
export function Demo({ children, code, html, align = 'center' }: DemoProps) {
  const { copy } = useLang();
  return (
    <Surface as="figure" className="site-demo" data-align={align}>
      <div className="site-demo-stage">{children}</div>
      <Code
        className="site-demo-code"
        code={code}
        html={inner(html)}
        filename={copy.example}
        language="tsx"
      />
    </Surface>
  );
}
