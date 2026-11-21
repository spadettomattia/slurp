import { Compare } from '@slurp-ui/react';

const tile = (bg: string, text: string) => (
  <div
    style={{ background: bg, height: 220, display: 'grid', placeItems: 'center', color: '#fff' }}
  >
    {text}
  </div>
);

export default function Basic() {
  return (
    <div style={{ maxWidth: 480 }}>
      <Compare before={tile('#5b5bd6', 'Prima')} after={tile('#2f9e6d', 'Dopo')} />
    </div>
  );
}
