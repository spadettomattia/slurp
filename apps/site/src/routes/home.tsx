import { Button, Flow, Frame, Text } from '@slurp-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { COPY } from '~/lib/i18n';

// The root URL: the browser's language picks the documentation (Italian otherwise); both are offered as links.
export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const en = !navigator.language.toLowerCase().startsWith('it');
    navigate(`/${en ? 'en' : 'it'}`, { replace: true });
  }, [navigate]);
  return (
    <Frame as="main" className="site-home">
      <Flow gap={6}>
        <title>Slurp UI</title>
        <Text font="display-xl" as="h1">
          Slurp UI
        </Text>
        <Text font="body-l" muted>
          {COPY.it.tagline} · {COPY.en.tagline}
        </Text>
        <Flow direction="row" gap={3}>
          <Button href={`${import.meta.env.BASE_URL}it`}>Italiano</Button>
          <Button appearance="outline" href={`${import.meta.env.BASE_URL}en`}>
            English
          </Button>
        </Flow>
      </Flow>
    </Frame>
  );
}
