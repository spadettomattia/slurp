import { Timeline } from '@slurp-ui/react';

export default function Basic() {
  return (
    <Timeline
      latestFirst
      items={[
        { title: 'Consegnato', time: '12 marzo 2026', dateTime: '2026-03-12' },
        {
          title: 'In consegna',
          time: '11 marzo 2026',
          dateTime: '2026-03-11',
          description: 'Il corriere ha preso in carico il pacco.',
        },
        { title: 'Preparato', time: '10 marzo 2026', dateTime: '2026-03-10' },
      ]}
    />
  );
}
