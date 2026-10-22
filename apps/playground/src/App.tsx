import {
  AccentScope,
  AnimationGroup,
  Cell,
  Flow,
  Frame,
  Ground,
  SlurpProvider,
  Surface,
  Text,
  useSlurp,
  type MotionOptions,
} from '@slurp-ui/react';
import type { SlurpAnimation, SlurpResult } from '@slurp-ui/react/motion';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { Controls, type Stats } from './Controls';
import { SECTIONS, type Section } from './data';

// Real-world test bed of the collapse / expand flow: entry grid → list, and back.

export type Settings = Pick<
  MotionOptions,
  'duration' | 'stagger' | 'goo' | 'ghost' | 'reducedMotion'
>;

const INITIAL: Settings = {
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
  /** The section shown as the current crumb of the Dock (also while it is being collapsed into). */
  const [crumb, setCrumb] = useState<Section | null>(null);
  /** null = entry grid. */
  const [view, setView] = useState<Section | null>(null);
  const [run, setRun] = useState<SlurpAnimation | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // After a navigation, focus goes to the title of the view.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [view]);

  const track = (r: SlurpAnimation, onEnd: (result: SlurpResult) => void) => {
    setRun(r);
    setStats(null);
    void watchFrames(r).then(setStats);
    void r.finished.then((result) => {
      setRun((current) => (current === r ? null : current));
      onEnd(result);
    });
  };

  const open = (s: Section) => {
    // The crumb is the target: it has to be on screen before the tiles collapse into it.
    flushSync(() => setCrumb(s));
    track(
      collapse({
        items: { group: 'tiles' },
        target: `crumb-${s.id}`,
        lead: `tile-${s.id}`,
        ...settings,
      }),
      (result) => {
        if (result === 'finished') setView(s);
        else setCrumb(null);
      },
    );
  };

  const back = () => {
    const s = crumb;
    if (!s) return;
    // The grid comes back first: its tiles are where the crumb bursts to.
    flushSync(() => setView(null));
    track(
      expand({
        source: `crumb-${s.id}`,
        items: { group: 'tiles' },
        lead: `tile-${s.id}`,
        ...settings,
      }),
      (result) => {
        if (result !== 'reversed') setCrumb(null);
      },
    );
  };

  return (
    <>
      <Frame as="main" css={{ pt: 8, pb: 48 }}>
        <Flow gap={6}>
          <Controls settings={settings} onSettings={setSettings} run={run} stats={stats} />
          {view ? (
            <AccentScope color={`hue-${view.hue}`} as="section" aria-labelledby="view-title">
              <Flow gap={5}>
                <Text font="display-l" id="view-title" ref={heading} tabIndex={-1}>
                  {view.label}
                </Text>
                <AnimationGroup id="cards">
                  <Cell
                    css={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: 4,
                    }}
                  >
                    {Array.from({ length: view.items }, (_, i) => (
                      <Surface key={i} animationId={`card-${i}`} css={{ p: 5, minHeight: 180 }}>
                        <Flow gap={2}>
                          <Text font="eyebrow">{view.label}</Text>
                          <Text font="title-s">Modello {i + 1}</Text>
                        </Flow>
                      </Surface>
                    ))}
                  </Cell>
                </AnimationGroup>
              </Flow>
            </AccentScope>
          ) : (
            <Flow as="section" gap={5} aria-labelledby="view-title">
              <Text font="display-xl" id="view-title" ref={heading} tabIndex={-1}>
                Di cosa hai bisogno?
              </Text>
              <AnimationGroup id="tiles">
                <Cell
                  css={{
                    display: 'grid',
                    gridTemplateColumns: { base: 'repeat(3, 1fr)', compact: 'repeat(2, 1fr)' },
                    gap: 4,
                  }}
                >
                  {SECTIONS.map((s) => (
                    <AccentScope
                      key={s.id}
                      as="button"
                      type="button"
                      color={`hue-${s.hue}`}
                      animationId={`tile-${s.id}`}
                      onClick={() => open(s)}
                      css={{
                        bg: 'accent',
                        color: 'on-accent',
                        radius: 'tile',
                        border: 0,
                        p: 6,
                        minHeight: 160,
                        display: 'flex',
                        alignItems: 'flex-end',
                        textAlign: 'left',
                        font: 'tile-label',
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </AccentScope>
                  ))}
                </Cell>
              </AnimationGroup>
            </Flow>
          )}
        </Flow>
      </Frame>

      <Surface
        as="nav"
        level="dock"
        radius="full"
        aria-label="Navigazione"
        css={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          p: 2,
          zIndex: 50,
        }}
      >
        <Cell
          as="button"
          type="button"
          onClick={back}
          disabled={!crumb}
          css={{ ...pill, bg: 'surface-2', color: 'fg' }}
        >
          Home
        </Cell>
        {crumb ? (
          <AccentScope
            as="button"
            type="button"
            color={`hue-${crumb.hue}`}
            animationId={`crumb-${crumb.id}`}
            aria-current="page"
            onClick={back}
            css={{ ...pill, bg: 'accent', color: 'on-accent' }}
          >
            {crumb.label}
          </AccentScope>
        ) : null}
      </Surface>
    </>
  );
}

const pill = {
  border: 0,
  radius: 'full',
  minHeight: 44,
  px: 5,
  font: 'label',
  cursor: 'pointer',
} as const;
