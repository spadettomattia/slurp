import {
  AnimationGroup,
  Bento,
  Button,
  Card,
  Chip,
  Dock,
  Empty,
  Fact,
  Filters,
  Flow,
  Frame,
  Ground,
  List,
  ListRow,
  Mark,
  matchesAll,
  ResultRow,
  Score,
  Settings,
  Shelf,
  SlurpProvider,
  Stage,
  Text,
  Tile,
  useFindInPage,
  useSlurp,
  type MotionOptions,
} from '@slurp-ui/react';
import { FiltersIcon } from '@slurp-ui/react/icons';
import type { SlurpAnimation, SlurpResult } from '@slurp-ui/react/motion';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { Controls, type Stats } from './Controls';
import { SECTIONS, type Item, type Section } from './data';

// Real-world test bed of the collapse / expand flow: entry grid → list → detail, and back.

export type MotionSettings = Pick<
  MotionOptions,
  'duration' | 'stagger' | 'goo' | 'ghost' | 'reducedMotion'
>;

const INITIAL: MotionSettings = {
  duration: 650,
  stagger: 0.35,
  goo: 'auto',
  ghost: 'shape',
  reducedMotion: 'user',
};

/** Frame timing while a transition runs: average fps and frames slower than 20ms. */
function watchFrames(run: SlurpAnimation): Promise<Stats> {
  const deltas: number[] = [];
  let last = 0;
  let raf = 0;
  const tick = (t: number) => {
    if (last) deltas.push(t - last);
    last = t;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return run.finished.then((result) => {
    cancelAnimationFrame(raf);
    const total = deltas.reduce((a, b) => a + b, 0);
    return {
      result,
      fps: total ? Math.round((deltas.length / total) * 1000) : 0,
      slow: deltas.filter((d) => d > 20).length,
    };
  });
}

interface Place {
  section?: Section;
  item?: Item;
}

const price = (n: number) => `${n.toLocaleString('it-IT')} €`;

export function App() {
  return (
    <SlurpProvider>
      <Ground />
      <Playground />
    </SlurpProvider>
  );
}

function Playground() {
  const { collapse, expand } = useSlurp();
  const [settings, setSettings] = useState(INITIAL);
  /** What the Dock shows (it leads the view while a collapse runs into its new crumb). */
  const [path, setPath] = useState<Place>({});
  /** What the page shows. */
  const [view, setView] = useState<Place>({});
  const [run, setRun] = useState<SlurpAnimation | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState(false);
  const [onlyUsed, setOnlyUsed] = useState(false);
  const [cheap, setCheap] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const page = useRef<HTMLElement>(null);
  const shownKey = `${view.section?.id ?? ''}/${view.item?.id ?? ''}`;
  const lastKey = useRef(shownKey);
  const find = useFindInPage(page, view.item ? query : '');

  // After a navigation, focus goes to the title of the view; the search starts empty.
  useEffect(() => {
    if (lastKey.current === shownKey) return;
    lastKey.current = shownKey;
    heading.current?.focus();
  }, [shownKey]);

  const track = (r: SlurpAnimation, onEnd: (result: SlurpResult) => void) => {
    setRun(r);
    setStats(null);
    void watchFrames(r).then(setStats);
    void r.finished.then((result) => {
      setRun((current) => (current === r ? null : current));
      onEnd(result);
    });
  };

  const openSection = (s: Section) => {
    // The crumb is the target: it has to be on screen before the tiles collapse into it.
    flushSync(() => {
      setPath({ section: s });
      setQuery('');
    });
    track(
      collapse({
        items: { group: 'tiles' },
        target: `crumb-${s.id}`,
        lead: `tile-${s.id}`,
        ...settings,
      }),
      (result) => {
        if (result === 'finished') setView({ section: s });
        else setPath({});
      },
    );
  };

  const openItem = (s: Section, it: Item) => {
    flushSync(() => setPath({ section: s, item: it }));
    track(
      collapse({
        items: { group: 'cards' },
        target: `crumb-${it.id}`,
        lead: `card-${it.id}`,
        ...settings,
      }),
      (result) => {
        if (result === 'finished') {
          setView({ section: s, item: it });
          setQuery('');
        } else setPath({ section: s });
      },
    );
  };

  /** One level up: the crumb being left bursts into the items of the level you return to. */
  const back = () => {
    setPanel(false);
    const { section, item } = path;
    if (section && item) {
      flushSync(() => {
        setView({ section });
        setQuery('');
      });
      track(
        expand({
          source: `crumb-${item.id}`,
          items: { group: 'cards' },
          lead: `card-${item.id}`,
          ...settings,
        }),
        (result) => {
          if (result !== 'reversed') setPath({ section });
        },
      );
    } else if (section) {
      flushSync(() => {
        setView({});
        setQuery('');
      });
      track(
        expand({
          source: `crumb-${section.id}`,
          items: { group: 'tiles' },
          lead: `tile-${section.id}`,
          ...settings,
        }),
        (result) => {
          if (result !== 'reversed') setPath({});
        },
      );
    }
  };

  const section = view.section;
  const shown = section
    ? section.items.filter(
        (it) =>
          matchesAll(`${it.name} ${it.brand} ${it.description}`, query) &&
          (!onlyUsed || it.used) &&
          (!cheap || it.price < 500),
      )
    : [];
  const results = !section
    ? SECTIONS.flatMap((s) => s.items.map((it) => ({ s, it }))).filter(
        ({ it }) => query.trim() && matchesAll(`${it.name} ${it.brand}`, query),
      )
    : [];
  const active = Number(onlyUsed) + Number(cheap);

  return (
    <>
      <Settings />
      <Frame as="main" ref={page} css={{ pt: 8, pb: 48 }}>
        <Flow gap={6}>
          <Controls settings={settings} onSettings={setSettings} run={run} stats={stats} />

          {!section && (
            <Flow as="section" gap={5} aria-labelledby="view-title">
              <Text font="display-xl" id="view-title" ref={heading} tabIndex={-1}>
                Di cosa hai bisogno?
              </Text>
              <AnimationGroup id="tiles">
                <Bento>
                  {SECTIONS.map((s) => (
                    <Tile
                      key={s.id}
                      title={s.label}
                      color={s.color}
                      weight={s.items.length}
                      animationId={`tile-${s.id}`}
                      onClick={() => openSection(s)}
                    />
                  ))}
                </Bento>
              </AnimationGroup>
            </Flow>
          )}

          {section && !view.item && (
            <Flow as="section" gap={5} aria-labelledby="view-title">
              <Text font="display-l" id="view-title" ref={heading} tabIndex={-1}>
                {section.label}
              </Text>
              <Text muted role="status">
                {shown.length === 1 ? '1 elemento' : `${shown.length} elementi`}
              </Text>
              {shown.length ? (
                <AnimationGroup id="cards">
                  <Shelf>
                    {shown.map((it) => (
                      <Card
                        key={it.id}
                        title={it.name}
                        description={it.brand}
                        value={price(it.price)}
                        valuePrefix="da"
                        badge={it.used ? 'Usato' : undefined}
                        color={section.color}
                        animationId={`card-${it.id}`}
                        onClick={() => openItem(section, it)}
                      />
                    ))}
                  </Shelf>
                </AnimationGroup>
              ) : (
                <Empty
                  title="Nessun risultato"
                  description="Prova con meno filtri o un’altra ricerca."
                  action={
                    <Button
                      onClick={() => {
                        setOnlyUsed(false);
                        setCheap(false);
                        setQuery('');
                      }}
                    >
                      Azzera filtri
                    </Button>
                  }
                />
              )}
            </Flow>
          )}

          {section && view.item && (
            <Flow as="article" gap={6} aria-labelledby="view-title">
              <Flow direction={{ base: 'row', compact: 'column' }} gap={6} align="center">
                <Stage color={section.color} css={{ flex: '1 1 0', width: '100%', height: 280 }}>
                  <Score score={view.item.score} />
                </Stage>
                <Flow gap={4} css={{ flex: '1 1 0' }}>
                  <Text font="display-l" id="view-title" ref={heading} tabIndex={-1}>
                    <Mark text={view.item.name} query={query} />
                  </Text>
                  <Flow direction="row" gap={3} wrap>
                    {view.item.facts.map((f) => (
                      <Fact
                        key={f.label}
                        label={f.label}
                        value={<Mark text={f.value} query={query} />}
                      />
                    ))}
                  </Flow>
                </Flow>
              </Flow>
              <Text font="body-l">
                <Mark text={view.item.description} query={query} />
              </Text>
              <List>
                <ListRow
                  title="Spedizione gratuita"
                  meta="Consegna in 24 ore"
                  tag="Consigliato"
                  highlighted
                  actionLabel="Dettagli"
                />
                <ListRow title="Ritiro in negozio" meta="Pronto in 2 ore" actionLabel="Dettagli" />
              </List>
            </Flow>
          )}
        </Flow>
      </Frame>

      <Dock
        panel={
          panel && section && !view.item ? (
            <Filters onReset={() => (setOnlyUsed(false), setCheap(false))} active={active}>
              <Filters.Group label="Condizione">
                <Chip selected={onlyUsed} onSelectedChange={setOnlyUsed}>
                  Solo usato
                </Chip>
              </Filters.Group>
              <Filters.Group label="Prezzo">
                <Chip selected={cheap} onSelectedChange={setCheap}>
                  Sotto i 500 €
                </Chip>
              </Filters.Group>
            </Filters>
          ) : !section && results.length ? (
            <Flow gap={1}>
              {results.slice(0, 5).map(({ s, it }) => (
                <ResultRow
                  key={it.id}
                  title={it.name}
                  meta={s.label}
                  value={price(it.price)}
                  onClick={() => {
                    setPath({ section: s, item: it });
                    setView({ section: s, item: it });
                    setQuery('');
                  }}
                />
              ))}
            </Flow>
          ) : null
        }
        panelLabel={section ? 'Filtri' : 'Risultati della ricerca'}
        focusPanel={!!section}
        onDismiss={() => {
          setPanel(false);
          if (!section) setQuery('');
        }}
      >
        {path.section && (
          <Dock.Crumbs>
            <Dock.Back onClick={back} />
            <Dock.Crumb
              current={!path.item}
              animationId={`crumb-${path.section.id}`}
              onClick={() => (path.item ? back() : undefined)}
            >
              {path.section.label}
            </Dock.Crumb>
            {path.item && (
              <Dock.Crumb current animationId={`crumb-${path.item.id}`}>
                {path.item.name}
              </Dock.Crumb>
            )}
          </Dock.Crumbs>
        )}
        <Dock.Search
          value={query}
          onValueChange={setQuery}
          placeholder={
            view.item
              ? `Cerca in ${view.item.name}…`
              : section
                ? `Cerca in ${section.label}…`
                : 'Cerca prodotti, marche, caratteristiche…'
          }
          {...(view.item ? { count: find.count, index: find.index, onStep: find.step } : null)}
        />
        {section && !view.item && (
          <Dock.Actions>
            <Dock.Action
              label="Filtri"
              count={active}
              expanded={panel}
              onClick={() => setPanel(!panel)}
            >
              <FiltersIcon />
            </Dock.Action>
          </Dock.Actions>
        )}
      </Dock>
    </>
  );
}
