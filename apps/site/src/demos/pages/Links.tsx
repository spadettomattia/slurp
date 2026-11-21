import { Pages } from '@slurp-ui/react';

export default function Links() {
  return <Pages count={8} defaultPage={2} href={(p) => `#pagina-${p}`} />;
}
