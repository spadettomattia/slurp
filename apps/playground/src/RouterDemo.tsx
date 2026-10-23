import {
  AnimationGroup,
  Bento,
  Card,
  Dock,
  Flow,
  Frame,
  Ground,
  Link,
  Shelf,
  SlurpProvider,
  Text,
  Tile,
  useSlurpEnter,
  useSlurpNavigate,
} from '@slurp-ui/react';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useMatch, useNavigate, useParams } from 'react-router';

import { SECTIONS } from './data';

// The same collapse / expand across real routes: /router is the grid, /router/:sectionId a section.
// The library imports no router: useSlurpNavigate wraps React Router's navigate.

const price = (n: number) => `${n.toLocaleString('it-IT')} €`;

export function RouterDemo() {
  return (
    <SlurpProvider>
      <Ground />
      <Layout />
    </SlurpProvider>
  );
}

function Layout() {
  const match = useMatch('/router/:sectionId');
  const section = SECTIONS.find((s) => s.id === match?.params.sectionId);
  const go = useSlurpNavigate(useNavigate());

  return (
    <>
      <Frame as="main" css={{ pt: 8, pb: 48 }}>
        <Outlet />
      </Frame>
      {section && (
        <Dock>
          <Dock.Crumbs>
            {/* Back to the grid: the crumb bursts into the tiles, its own tile first. */}
            <Dock.Back
              onClick={() =>
                go('/router', { from: `crumb-${section.id}`, lead: `tile-${section.id}` })
              }
            />
            <Dock.Crumb current animationId={`crumb-${section.id}`}>
              {section.label}
            </Dock.Crumb>
          </Dock.Crumbs>
        </Dock>
      )}
    </>
  );
}

/** After a navigation (not on the first load) focus goes to the title of the route. */
function useRouteHeading() {
  const heading = useRef<HTMLHeadingElement>(null);
  const navigated = useLocation().key !== 'default';
  useEffect(() => {
    if (navigated) heading.current?.focus();
  }, [navigated]);
  return heading;
}

export function GridRoute() {
  const go = useSlurpNavigate(useNavigate());
  const heading = useRouteHeading();
  const intro = useRef<HTMLDivElement>(null);
  // The tiles are the targets: only the title and the text fade in.
  useSlurpEnter({ group: 'tiles' }, { content: intro });

  return (
    <Flow as="section" gap={5} aria-labelledby="view-title">
      <Flow gap={5} ref={intro}>
        <Text font="display-xl" id="view-title" ref={heading} tabIndex={-1}>
          Di cosa hai bisogno?
        </Text>
        <Text muted>
          Ogni sezione è una route di React Router. <Link href="/">Torna al playground</Link>
        </Text>
      </Flow>
      <AnimationGroup id="tiles">
        <Bento>
          {SECTIONS.map((s) => (
            <Tile
              key={s.id}
              title={s.label}
              color={s.color}
              weight={s.items.length}
              animationId={`tile-${s.id}`}
              onClick={() =>
                go(`/router/${s.id}`, {
                  from: { group: 'tiles' },
                  lead: `tile-${s.id}`,
                  to: `crumb-${s.id}`,
                })
              }
            />
          ))}
        </Bento>
      </AnimationGroup>
    </Flow>
  );
}

export function SectionRoute() {
  const { sectionId } = useParams();
  const section = SECTIONS.find((s) => s.id === sectionId);
  const heading = useRouteHeading();
  const page = useRef<HTMLElement>(null);
  // The target comes with the handoff (the crumb, in the Dock): the whole page fades in while it lands.
  // The key replays it if only the param changes.
  useSlurpEnter(undefined, { key: sectionId, content: page });

  if (!section) {
    return (
      <Text font="display-l" as="h1">
        Sezione non trovata
      </Text>
    );
  }
  return (
    <Flow as="section" gap={5} aria-labelledby="view-title" ref={page}>
      <Text font="display-l" id="view-title" ref={heading} tabIndex={-1}>
        {section.label}
      </Text>
      <Shelf>
        {section.items.map((it) => (
          <Card
            key={it.id}
            title={it.name}
            description={it.brand}
            value={price(it.price)}
            valuePrefix="da"
            badge={it.used ? 'Usato' : undefined}
            color={section.color}
          />
        ))}
      </Shelf>
    </Flow>
  );
}
