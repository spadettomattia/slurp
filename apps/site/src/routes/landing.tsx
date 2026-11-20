import { ArrowLeftIcon, ChevronRightIcon, SearchIcon } from '@slurp-ui/icons';
import {
  AccentScope,
  AnimationGroup,
  Avatar,
  Bento,
  Bubble,
  Button,
  Card,
  Chip,
  Choice,
  Code,
  Count,
  Flow,
  Notice,
  Progress,
  Range,
  Rating,
  Score,
  Segmented,
  Steps,
  Surface,
  Switch,
  Text,
  useMediaQuery,
  useSlurp,
  useSlurpEnter,
} from '@slurp-ui/react';
import type { SlurpAnimation } from '@slurp-ui/react/motion';
import { hue } from '@slurp-ui/react/tokens';
import apiIndex from 'virtual:slurp-api-index';
import { useEffect, useRef, useState } from 'react';

import type { Lang } from '../../site.config';
import { PauseIcon, PlayIcon } from '@slurp-ui/react/icons';
import { TileLink } from '~/components/Links';
import { AVAILABLE } from '~/lib/available';
import { href, useLang } from '~/lib/lang';
import { motionIds, useLinkProps } from '~/lib/link';
import { API_SECTION, NAV, tint } from '~/lib/nav';

const INSTALL = 'npm install @slurp-ui/react';

const TEXT = {
  it: {
    title: 'Componenti React che si fondono, come cellule',
    lead: 'Per andare avanti n elementi si fondono in uno, per tornare indietro uno esplode in n. Attorno, controlli pronti, superfici fluttuanti e il Dock.',
    facts: (components: number) => [
      `${components} componenti`,
      'WCAG AA, chiaro e scuro',
      'testi in italiano e inglese',
    ],
    start: 'Inizia',
    explore: 'Esplora i componenti',
    github: 'GitHub',
    stage: 'Anteprima animata: le sezioni si fondono nella briciola del Dock e tornano indietro',
    pause: 'Metti in pausa l’animazione',
    play: 'Riprendi l’animazione',
    sections: ['Inizio', 'Esplora', 'Raccolte', 'Attività', 'Archivio'],
    choose: 'Scegli',
    search: 'Cerca…',
    showcase: 'Componenti pronti all’uso',
    showcaseLead:
      'Ogni controllo è accessibile da tastiera e da lettore di schermo, segue il tema e prende il colore dal contenuto.',
    view: 'Vista',
    grid: 'Griglia',
    list: 'Lista',
    recent: 'Recenti',
    starred: 'Preferiti',
    notify: 'Ricevi le notifiche',
    level: 'Intensità',
    rate: 'Il tuo voto',
    sort: 'Ordina per',
    relevance: 'Rilevanza',
    newest: 'Più recenti',
    score: 'Punteggio',
    saved: 'Salvato nei preferiti',
    savedText: 'Lo ritrovi nella tua lista.',
    sync: 'Sincronizzazione',
    steps: ['Scelta', 'Dettagli', 'Conferma'],
    cardTitle: 'Titolo della card',
    cardText: 'Una riga di descrizione',
    badge: 'Novità',
    inbox: 'Messaggi',
    person: 'Persona di esempio',
    unread: 'nuovi',
    explore2: 'Esplora la documentazione',
  },
  en: {
    title: 'React components that merge, like cells',
    lead: 'To go forward n elements merge into one, to go back one bursts into n. Around it, ready-made controls, floating surfaces and the Dock.',
    facts: (components: number) => [
      `${components} components`,
      'WCAG AA, light and dark',
      'texts in Italian and English',
    ],
    start: 'Get started',
    explore: 'Explore the components',
    github: 'GitHub',
    stage: 'Animated preview: the sections merge into the Dock’s crumb and come back',
    pause: 'Pause the animation',
    play: 'Play the animation',
    sections: ['Start', 'Explore', 'Collections', 'Activity', 'Archive'],
    choose: 'Choose',
    search: 'Search…',
    showcase: 'Components ready to use',
    showcaseLead:
      'Every control works with the keyboard and screen readers, follows the theme and takes its colour from the content.',
    view: 'View',
    grid: 'Grid',
    list: 'List',
    recent: 'Recent',
    starred: 'Starred',
    notify: 'Get notifications',
    level: 'Intensity',
    rate: 'Your rating',
    sort: 'Sort by',
    relevance: 'Relevance',
    newest: 'Newest',
    score: 'Score',
    saved: 'Saved to favourites',
    savedText: 'You will find it in your list.',
    sync: 'Syncing',
    steps: ['Choice', 'Details', 'Confirm'],
    cardTitle: 'Card title',
    cardText: 'One line of description',
    badge: 'New',
    inbox: 'Messages',
    person: 'Sample person',
    unread: 'new',
    explore2: 'Explore the documentation',
  },
} satisfies Record<Lang, Record<string, string | string[] | ((n: number) => string[])>>;

type Copy = (typeof TEXT)[Lang];

const HUES = ['violet', 'blue', 'teal', 'orange', 'pink'] as const;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The signature, playing by itself: a small Slurp interface whose sections collapse into the Dock's crumb and burst
 * back out, a different one each time. It pauses when it is out of sight, on demand (a pause button, WCAG 2.2.2) and
 * does not start by itself when the person prefers less motion.
 */
function HeroMotion({ t }: { t: Copy }) {
  const { collapse, expand } = useSlurp();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paused, setPaused] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  /** The section the next round starts from (each round picks another). */
  const from = useRef(1);
  const root = useRef<HTMLElement>(null);
  const on = !(paused ?? reduced);
  const playing = on && visible;

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) =>
      setVisible(!!e?.isIntersecting && !document.hidden),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let live = true;
    let run: SlurpAnimation | null = null;
    void (async () => {
      while (live) {
        const i = from.current;
        await wait(1300);
        if (!live) return;
        run = collapse({ items: { group: 'hero' }, target: 'hero-crumb', lead: `hero-${i}` });
        if ((await run.finished) !== 'finished' || !live) return;
        setChosen(i);
        await wait(1500);
        if (!live) return;
        setChosen(null);
        run = expand({ source: 'hero-crumb', items: { group: 'hero' }, lead: `hero-${i}` });
        if ((await run.finished) !== 'finished' || !live) return;
        from.current = (i + 2) % HUES.length;
      }
    })();
    return () => {
      live = false;
      run?.cancel();
    };
  }, [playing, collapse, expand]);

  const crumbHue = chosen === null ? 'violet' : HUES[chosen];
  return (
    <Surface as="figure" className="site-hero-motion" ref={root} aria-label={t.stage}>
      <div className="site-hero-stage" aria-hidden="true">
        <AnimationGroup id="hero">
          <div className="site-hero-tiles">
            {HUES.map((h, i) => (
              <AccentScope
                key={h}
                color={`hue-${h}`}
                animationId={`hero-${i}`}
                className="site-hero-tile"
                data-hidden={chosen !== null || undefined}
              >
                {t.sections[i]}
              </AccentScope>
            ))}
          </div>
        </AnimationGroup>
        <div className="site-hero-dock">
          <span className="site-hero-back">
            <ArrowLeftIcon size={18} />
          </span>
          <AccentScope
            color={`hue-${crumbHue}`}
            animationId="hero-crumb"
            className="site-hero-crumb"
            data-empty={chosen === null || undefined}
          >
            {chosen === null ? t.choose : t.sections[chosen]}
          </AccentScope>
          <span className="site-hero-search">
            <SearchIcon size={16} />
            {t.search}
          </span>
        </div>
      </div>
      <Bubble
        size="sm"
        appearance="soft"
        tone="neutral"
        className="site-hero-pause"
        label={on ? t.pause : t.play}
        onClick={() => {
          setPaused(on);
          // Paused inside the crumb: the sections come back to the grid.
          if (on) setChosen(null);
        }}
      >
        {on ? <PauseIcon /> : <PlayIcon />}
      </Bubble>
    </Surface>
  );
}

/** A collage of live components: what the library draws, ready to touch. */
function Showcase({ t }: { t: Copy }) {
  const [recent, setRecent] = useState(true);
  const [starred, setStarred] = useState(false);
  return (
    <div className="site-showcase">
      <Card
        className="site-showcase-card"
        title={t.cardTitle}
        description={t.cardText}
        badge={t.badge}
        color={hue.teal}
        media={<Score score={9.1} size={88} label={t.score} />}
      />
      <Surface className="site-showcase-piece">
        <Flow gap={4}>
          <Segmented
            label={t.view}
            options={[
              { value: 'grid', label: t.grid },
              { value: 'list', label: t.list },
            ]}
          />
          <Flow direction="row" gap={2} wrap>
            <Chip selected={recent} onSelectedChange={setRecent}>
              {t.recent}
            </Chip>
            <Chip selected={starred} onSelectedChange={setStarred}>
              {t.starred}
            </Chip>
          </Flow>
          <Choice
            label={t.sort}
            defaultValue="relevance"
            options={[
              { value: 'relevance', label: t.relevance },
              { value: 'newest', label: t.newest },
            ]}
          />
        </Flow>
      </Surface>
      <Surface className="site-showcase-piece">
        <Flow gap={4}>
          <Range label={t.level} defaultValue={60} formatValue={(v) => `${v}%`} />
          <Rating label={t.rate} defaultValue={4} />
          <Switch defaultChecked>{t.notify}</Switch>
        </Flow>
      </Surface>
      <Surface className="site-showcase-piece">
        <Flow gap={4}>
          <Steps
            steps={t.steps.map((s, i) => ({ value: String(i), label: s }))}
            defaultValue="1"
            navigable="none"
          />
          <Notice tone="success" title={t.saved}>
            {t.savedText}
          </Notice>
          <Flow direction="row" gap={4} align="center" wrap>
            <Progress label={t.sync} value={72} shape="ring" showValue />
            <span className="site-showcase-avatar">
              <Avatar name={t.person} />
              <Count value={3} label={(n) => `${n} ${t.unread}`} />
            </span>
            <Button appearance="soft">{t.inbox}</Button>
          </Flow>
        </Flow>
      </Surface>
    </div>
  );
}

/**
 * The home (mui.com's front page in Slurp's terms): the signature transition playing next to what the library is
 * and how to start, then a collage of live components, then the sections of the documentation as an entry grid.
 */
export default function Landing() {
  const { lang, copy } = useLang();
  const t = TEXT[lang];
  const intro = useRef<HTMLDivElement>(null);
  const start = useLinkProps(href(lang, 'getting-started/installation'));
  const explore = useLinkProps(href(lang, 'components'));
  // Back from a section: its crumb bursts into the tiles (its own tile first); the rest fades in.
  useSlurpEnter({ group: motionIds.tiles }, { content: intro });

  const sections = NAV.map((s) => ({
    ...s,
    count: s.groups.reduce(
      (n, g) => n + g.pages.filter((p) => AVAILABLE.has(`${lang}/${p.slug}`)).length,
      0,
    ),
  })).filter((s) => s.count > 0);
  const modules = new Set(apiIndex.map((c) => c.module)).size;
  const open = (id: string) => ({
    from: { group: motionIds.tiles },
    lead: motionIds.tile(id),
    to: motionIds.sectionCrumb(id),
  });

  return (
    <div className="site-landing">
      <title>{`Slurp UI · ${copy.tagline}`}</title>
      <div ref={intro}>
        <div className="site-hero-grid">
          <Flow gap={5} className="site-hero-text">
            <Text font="display-xl" as="h1" tabIndex={-1}>
              {t.title}
            </Text>
            <Text font="body-l" muted>
              {t.lead}
            </Text>
            <ul className="site-facts">
              {t.facts(modules).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Flow direction="row" gap={3} wrap>
              <Button size="lg" {...start} endIcon={<ChevronRightIcon />}>
                {t.start}
              </Button>
              <Button size="lg" appearance="soft" {...explore}>
                {t.explore}
              </Button>
            </Flow>
            <Code className="site-install" code={INSTALL} language="bash" />
          </Flow>
          <HeroMotion t={t} />
        </div>

        <section className="site-feature" aria-labelledby="showcase-title">
          <Flow gap={3} className="site-feature-text">
            <Text font="title-xl" as="h2" id="showcase-title">
              {t.showcase}
            </Text>
            <Text font="body-l" muted>
              {t.showcaseLead}
            </Text>
          </Flow>
          <Showcase t={t} />
        </section>

        <Text font="title-xl" as="h2" className="site-explore-title">
          {t.explore2}
        </Text>
      </div>
      <AnimationGroup id={motionIds.tiles}>
        <Bento>
          {sections.map((s) => (
            <TileLink
              key={s.id}
              to={href(lang, s.id)}
              title={s.title[lang]}
              subtitle={s.subtitle[lang]}
              badge={copy.pages(s.count)}
              color={tint(s.hue)}
              weight={s.count}
              animationId={motionIds.tile(s.id)}
              slurp={open(s.id)}
            />
          ))}
          <TileLink
            to={href(lang, API_SECTION.id)}
            title={API_SECTION.title[lang]}
            subtitle={API_SECTION.subtitle[lang]}
            badge={copy.pages(modules)}
            color={tint(API_SECTION.hue)}
            weight={modules}
            animationId={motionIds.tile(API_SECTION.id)}
            slurp={open(API_SECTION.id)}
          />
        </Bento>
      </AnimationGroup>
    </div>
  );
}
