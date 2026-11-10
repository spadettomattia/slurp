import { Button, Flow, Frame, Text } from '@slurp-ui/react';
import { Link, useLocation } from 'react-router';

import { COPY } from '~/lib/i18n';
import { langOf } from '~/lib/lang';

export default function NotFound() {
  const lang = langOf(useLocation().pathname);
  const copy = COPY[lang];
  return (
    <Frame as="main" className="site-home">
      <title>{`${copy.notFound} · Slurp UI`}</title>
      <Flow gap={4}>
        <Text font="display-l">{copy.notFound}</Text>
        <Text muted>{copy.notFoundText}</Text>
        <div>
          <Button as={Link} to={`/${lang}/getting-started/overview`}>
            {copy.backHome}
          </Button>
        </div>
      </Flow>
    </Frame>
  );
}
