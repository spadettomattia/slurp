import { Button, Surface } from '@slurp-ui/react';
import { useId, useState, type ReactNode } from 'react';

import { useLang } from '~/lib/lang';
import { CopyButton } from './Copy';

export interface DemoProps {
  /** The live example. */
  children: ReactNode;
  /** Its source, as shown, and highlighted. */
  code: string;
  html: string;
  /** Opens with the code shown. */
  open?: boolean;
  /** Centres the example (default) or lets it fill the width. */
  align?: 'center' | 'stretch';
}

/**
 * A live example and, one press away, the code that renders it (mui.com's demos), on one translucent Surface: the
 * example on its tinted stage, the controls, the code. No frame around separate boxes.
 */
export function Demo({ children, code, html, open = false, align = 'center' }: DemoProps) {
  const { copy } = useLang();
  const [shown, setShown] = useState(open);
  const id = useId();
  return (
    <Surface as="figure" className="site-demo" data-align={align}>
      <div className="site-demo-stage">{children}</div>
      <div className="site-demo-bar">
        <Button
          appearance="plain"
          tone="neutral"
          size="sm"
          aria-expanded={shown}
          aria-controls={id}
          onClick={() => setShown((s) => !s)}
        >
          {shown ? copy.hideCode : copy.showCode}
        </Button>
        <CopyButton text={code} />
      </div>
      <div
        id={id}
        className="site-demo-code"
        hidden={!shown}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Surface>
  );
}
