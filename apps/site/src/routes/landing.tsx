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
  Reveal,
  Rise,
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
import { Faq } from '~/components/Faq';
import { TileLink } from '~/components/Links';
import { AVAILABLE } from '~/lib/available';
import { href, useLang } from '~/lib/lang';
import { motionIds, useLinkProps } from '~/lib/link';
import { API_SECTION, NAV, tint } from '~/lib/nav';

const INSTALL = 'npm install @slurp-ui/react';

const TEXT = {
  it: {
    eyebrow: 'Design system React open source',
    title: 'Interfacce React accessibili, con una navigazione che si trasforma',
    lead: (components: number) =>
      `Slurp UI è una libreria di ${components} componenti React con tema chiaro e scuro, pensati per la tastiera e per i lettori di schermo. Il suo tratto distintivo: le sezioni si fondono in una sola briciola e tornano indietro, e tutta la navigazione vive in un unico Dock.`,
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
    eyebrow: 'Open source React design system',
    title: 'Accessible React interfaces, with a navigation that transforms',
    lead: (components: number) =>
      `Slurp UI is a library of ${components} React components with light and dark themes, built for the keyboard and for screen readers. Its signature: sections merge into a single crumb and burst back out, and all the navigation lives in one Dock.`,
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
} satisfies Record<Lang, Record<string, string | string[] | ((n: number) => string | string[])>>;

type Copy = (typeof TEXT)[Lang];

/** The argument of the page: what you get (outcomes, from what the repository checks), how to start, the last invitation. */
const ARGUMENT = {
  it: {
    eyebrows: {
      showcase: 'Componenti',
      benefits: 'Perché Slurp',
      steps: 'Per iniziare',
      explore: 'Documentazione',
    },
    benefitsTitle: 'Perché usare Slurp UI',
    benefitsLead: 'Ciò che ottieni senza lavoro in più, verificato dai test del repository.',
    benefits: [
      [
        'Si usano da tastiera e da lettore di schermo',
        'Ogni componente ha nomi e ruoli corretti e un test automatico di accessibilità: non devi aggiungere nulla.',
      ],
      [
        'Un tema da pochi valori',
        'Accento, caratteri e raggio in createTheme: i token si generano da soli, in chiaro e in scuro.',
      ],
      [
        'Poco codice da scaricare',
        'Pulsante e provider pesano meno di 8 kB compressi, l’intera libreria meno di 50 kB.',
      ],
      [
        'Italiano e inglese, e i tuoi testi',
        'I componenti parlano due lingue; per altre passi i tuoi testi con una sola proprietà del provider.',
      ],
    ],
    tagline:
      'Un solo posto per navigare, controlli che restano accessibili e un tema che segue il tuo colore.',
    stepsTitle: 'Inizia in tre passi',
    stepsLead: 'Dall’installazione al primo componente in pochi minuti.',
    exploreLead:
      'Guide, componenti, personalizzazione, movimento e riferimento API: scegli da dove partire.',
    steps: [
      ['Installa il pacchetto', 'npm install @slurp-ui/react', 'bash'],
      [
        'Importa lo stile e avvolgi l’app',
        'import \'@slurp-ui/react/styles.css\';\n\n<SlurpProvider labels="it">\n  <Ground />\n  <App />\n</SlurpProvider>',
        'tsx',
      ],
      [
        'Usa un componente',
        "import { Button } from '@slurp-ui/react';\n\n<Button>Salva</Button>",
        'tsx',
      ],
    ],
    ctaTitle: 'Prova Slurp UI nel tuo progetto',
    ctaLead: 'Gratuita e con licenza MIT: la installi e la provi senza registrarti.',
  },
  en: {
    eyebrows: {
      showcase: 'Components',
      benefits: 'Why Slurp',
      steps: 'Getting started',
      explore: 'Documentation',
    },
    benefitsTitle: 'Why use Slurp UI',
    benefitsLead: 'What you get with no extra work, checked by the repository’s tests.',
    benefits: [
      [
        'Works with the keyboard and screen readers',
        'Every component has correct names and roles and an automated accessibility test: you add nothing.',
      ],
      [
        'A theme from a few values',
        'Accent, typefaces and radius in createTheme: the tokens generate themselves, in light and dark.',
      ],
      [
        'Little code to download',
        'Button and the provider weigh under 8 kB compressed, the whole library under 50 kB.',
      ],
      [
        'Italian and English, and your own texts',
        'Components speak two languages; for others you pass your texts with one provider property.',
      ],
    ],
    tagline:
      'One place to navigate, controls that stay accessible and a theme that follows your colour.',
    stepsTitle: 'Start in three steps',
    stepsLead: 'From installing to your first component in a few minutes.',
    exploreLead:
      'Guides, components, customisation, motion and API reference: choose where to start.',
    steps: [
      ['Install the package', 'npm install @slurp-ui/react', 'bash'],
      [
        'Import the style and wrap the app',
        'import \'@slurp-ui/react/styles.css\';\n\n<SlurpProvider labels="en">\n  <Ground />\n  <App />\n</SlurpProvider>',
        'tsx',
      ],
      [
        'Use a component',
        "import { Button } from '@slurp-ui/react';\n\n<Button>Save</Button>",
        'tsx',
      ],
    ],
    ctaTitle: 'Try Slurp UI in your project',
    ctaLead: 'Free and MIT licensed: install it and try it without signing up.',
  },
} as const;

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
 * The head every section of the home shares (tailwindcss.com's): a small label, the title and a line under it, then the
 * content across the full width.
 */
function SectionHead({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <Flow gap={2} className="site-section-head">
      <p className="site-eyebrow">{eyebrow}</p>
      <Text font="title-xl" as="h2" id={id}>
        {title}
      </Text>
      <Text font="body-l" muted>
        {lead}
      </Text>
    </Flow>
  );
}

/**
 * The home (mui.com's front page in Slurp's terms): the signature transition playing next to what the library is
 * and how to start, then a collage of live components, then the sections of the documentation as an entry grid.
 */
export default function Landing() {
  const { lang, copy } = useLang();
  const t = TEXT[lang];
  const arg = ARGUMENT[lang];
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
            <p className="site-eyebrow">{t.eyebrow}</p>
            <Text font="display-xl" as="h1" tabIndex={-1}>
              {t.title}
            </Text>
            <Text font="body-l" muted>
              {t.lead(modules)}
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

        <Rise as="section" className="site-section" aria-labelledby="showcase-title">
          <SectionHead
            id="showcase-title"
            eyebrow={arg.eyebrows.showcase}
            title={t.showcase}
            lead={t.showcaseLead}
          />
          <div className="site-panel">
            <Showcase t={t} />
          </div>
        </Rise>

        <Rise as="section" className="site-section" aria-labelledby="benefits-title">
          <SectionHead
            id="benefits-title"
            eyebrow={arg.eyebrows.benefits}
            title={arg.benefitsTitle}
            lead={arg.benefitsLead}
          />
          <ul className="site-benefits">
            {arg.benefits.map(([title, text], i) => (
              <Rise as="li" key={title} delay={i * 60}>
                <Surface className="site-benefit">
                  <Text font="title-s" as="h3">
                    {title}
                  </Text>
                  <Text font="body-s" muted>
                    {text}
                  </Text>
                </Surface>
              </Rise>
            ))}
          </ul>
        </Rise>

        <section className="site-tagline">
          <Reveal as="h2">{arg.tagline}</Reveal>
        </section>

        <Rise as="section" className="site-section" aria-labelledby="steps-title">
          <SectionHead
            id="steps-title"
            eyebrow={arg.eyebrows.steps}
            title={arg.stepsTitle}
            lead={arg.stepsLead}
          />
          <ol className="site-how">
            {arg.steps.map(([title, code, language], i) => (
              <Rise as="li" key={title} delay={i * 60} className="site-how-step">
                <span className="site-how-number" aria-hidden="true">
                  {i + 1}
                </span>
                <Text font="title-s" as="h3">
                  {title}
                </Text>
                <Code code={code} language={language} />
              </Rise>
            ))}
          </ol>
        </Rise>
      </div>
      <section className="site-section" aria-labelledby="explore-title">
        <SectionHead
          id="explore-title"
          eyebrow={arg.eyebrows.explore}
          title={t.explore2}
          lead={arg.exploreLead}
        />
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
      </section>

      <Rise as="section" className="site-section" aria-labelledby="faq-title">
        <Faq />
      </Rise>

      <Rise as="section" className="site-section" aria-labelledby="final-title">
        <Surface className="site-final">
          <Flow gap={2}>
            <Text font="title-xl" as="h2" id="final-title">
              {arg.ctaTitle}
            </Text>
            <Text font="body-l" muted>
              {arg.ctaLead}
            </Text>
          </Flow>
          <Flow direction="row" gap={3} wrap>
            <Button size="lg" {...start} endIcon={<ChevronRightIcon />}>
              {t.start}
            </Button>
            <Button size="lg" appearance="soft" {...explore}>
              {t.explore}
            </Button>
          </Flow>
        </Surface>
      </Rise>
    </div>
  );
}
