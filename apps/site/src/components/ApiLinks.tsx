import { Button } from '@slurp-ui/react';
import { Link } from 'react-router';

import { REPO } from '../../site.config';
import { href, useLang } from '~/lib/lang';
import { CodeIcon } from './icons';

/** The row under a component's title (like mui.com's chips): its API pages and its source. */
export function ApiLinks({ modules }: { modules: string[] }) {
  const { lang, copy } = useLang();
  return (
    <div className="site-chips">
      {modules.map((m) => (
        <Button
          key={m}
          as={Link}
          to={href(lang, `api/${m.toLowerCase()}`)}
          appearance="soft"
          size="sm"
        >
          {copy.apiTitle(m)}
        </Button>
      ))}
      <Button
        as="a"
        href={`${REPO}/tree/main/packages/ui/src/${modules[0] ?? ''}`}
        target="_blank"
        rel="noreferrer"
        appearance="outline"
        tone="neutral"
        size="sm"
        icon={<CodeIcon />}
      >
        {copy.source}
      </Button>
    </div>
  );
}
