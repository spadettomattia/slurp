import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useRef, useState, type ComponentType } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Bento,
  bentoLayout,
  Card,
  Chip,
  createTheme,
  Dock,
  Empty,
  Fact,
  Filters,
  Link,
  List,
  ListRow,
  Mark,
  matchesAll,
  matchRanges,
  ResultRow,
  Score,
  Settings,
  Shelf,
  SlurpProvider,
  Stage,
  Tile,
  useFindInPage,
} from '../src';
import { expectNoAxeViolations } from './axe';

afterEach(() => vi.unstubAllGlobals());

type Any = ComponentType<Record<string, unknown>>;

const components: [string, Any, string, Record<string, unknown>][] = [
  ['Tile', Tile as Any, 'slurp-tile', { title: 'Smartphone', color: '#8b6fff' }],
  ['Bento', Bento as Any, 'slurp-bento', {}],
  ['Card', Card as Any, 'slurp-card', { title: 'iPhone 16', href: '#p' }],
  ['Shelf', Shelf as Any, 'slurp-shelf', {}],
  ['Stage', Stage as Any, 'slurp-stage', {}],
  ['Fact', Fact as Any, 'slurp-fact', { label: 'Peso', value: '170 g' }],
  ['Score', Score as Any, 'slurp-score', { score: 9.1 }],
  ['List', List as Any, 'slurp-list', {}],
  ['ListRow', ListRow as Any, 'slurp-list-row', { title: 'Garanzia' }],
  ['ResultRow', ResultRow as Any, 'slurp-result-row', { title: 'Pixel 9' }],
  ['Empty', Empty as Any, 'slurp-empty', { title: 'Nessun risultato' }],
  ['Link', Link as Any, 'slurp-link', { href: '#', children: 'Dettagli' }],
  ['Filters', Filters as Any, 'slurp-filters', {}],
  ['Dock', Dock as Any, 'slurp-dock-wrap', { inline: true }],
];

describe.each(components)('%s (shared API)', (name, Component, rootClass, required) => {
  it('renders its root with the class, forwarding className, style, ref and unknown props', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Component
        {...required}
        ref={ref}
        className="mine"
        style={{ marginTop: 3 }}
        data-testid="root"
      />,
    );
    const root = container.querySelector(`.${rootClass}`) as HTMLElement;
    expect(root.classList.contains('mine')).toBe(true);
    expect(root.style.marginTop).toBe('3px');
    expect(root.dataset.testid).toBe('root');
    expect(ref.current).toBe(root);
  });

  it('renders as another element with `as`', () => {
    const { container } = render(<Component {...required} as="section" />);
    expect(container.querySelector(`section.${rootClass}`)).not.toBeNull();
  });

  it('registers for motion with animationId', async () => {
    const { registry } = await import('@slurp-ui/motion');
    const { container, unmount } = render(<Component {...required} animationId={`${name}-m`} />);
    expect(registry.resolve(`${name}-m`)[0]?.el).toBe(container.querySelector(`.${rootClass}`));
    unmount();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <Component {...required} />
      </main>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('bentoLayout', () => {
  it('puts the first item tall on the left and fills 12 columns per row', () => {
    const spans = bentoLayout(
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id, i) => ({ id, weight: 10 - i })),
    );
    expect(spans[0]).toMatchObject({ rowSpan: 2, size: 'large' });
    const [c0 = 0, c1 = 0, c2 = 0, c3 = 0] = spans.map((s) => s.colSpan);
    expect(c0).toBeGreaterThanOrEqual(4);
    expect(c0).toBeLessThanOrEqual(6);
    expect(c0 + c1).toBe(12);
    expect(c2 + c3).toBe(c1);
    expect(spans.slice(4).reduce((a, s) => a + s.colSpan, 0)).toBe(12);
    expect(bentoLayout([{ id: 'x' }])[0]).toMatchObject({ rowSpan: 2, size: 'large' });
    expect(bentoLayout([])).toEqual([]);
  });

  it('Bento layout="auto" gives each child its span and size', () => {
    const { container } = render(
      <Bento>
        <Tile title="A" color="#8b6fff" weight={9} />
        <Tile title="B" color="#22aa88" weight={4} />
        <Tile title="C" color="#ee5588" />
      </Bento>,
    );
    const [a, b] = container.querySelectorAll<HTMLElement>('.slurp-tile');
    expect(a?.style.getPropertyValue('--slurp-bento-rows')).toBe('2');
    expect(a?.dataset.size).toBe('large');
    expect(
      Number(a?.style.getPropertyValue('--slurp-bento-cols')) +
        Number(b?.style.getPropertyValue('--slurp-bento-cols')),
    ).toBe(12);
    expect(a?.hasAttribute('weight')).toBe(false);
  });
});

describe('Tile, Card, Score, ListRow', () => {
  it('Tile is a button tinted by its colour; the collapse saturates toward it', () => {
    render(<Tile title="Smartphone" subtitle="128 modelli" badge="Novità" color="#8b6fff" />);
    const tile = screen.getByRole('button', { name: /Smartphone/ });
    expect(tile.style.getPropertyValue('--slurp-tile-color')).toBe('#8b6fff');
    expect(tile.style.getPropertyValue('--slurp-animation-tint')).toBe('#8b6fff');
  });

  it('Card is a link with href, a button with onClick, a plain box otherwise', () => {
    render(
      <>
        <Card title="Link" href="/p/1" description="Apple" value="1.239 €" valuePrefix="da" />
        <Card title="Bottone" onClick={() => undefined} />
        <Card title="Box" />
      </>,
    );
    expect(screen.getByRole('link', { name: /Link/ }).textContent).toContain('da 1.239 €');
    expect(screen.getByRole('button', { name: 'Bottone' })).toBeDefined();
    expect(screen.getByText('Box').closest('.slurp-card')?.tagName).toBe('DIV');
  });

  it('Score has one decimal and says it all', () => {
    render(<Score score={9.12} label="Voto" />);
    expect(screen.getByRole('img', { name: 'Voto 9.1 su 10' })).toBeDefined();
  });

  it('ListRow: list item inside List, tag with a check, the action names its row', () => {
    render(
      <List>
        <ListRow
          title="Garanzia"
          meta="2 anni"
          value="9.1"
          tag="Consigliato"
          highlighted
          actionLabel="Vedi"
          href="/g"
        />
      </List>,
    );
    const row = screen.getByRole('listitem');
    expect(row.dataset.highlighted).toBe('true');
    expect(
      within(row).getByText('Consigliato').closest('span')?.querySelector('svg'),
    ).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Vedi Garanzia' }).getAttribute('href')).toBe('/g');
  });

  it('Shelf wraps each card in a list item', () => {
    render(
      <Shelf>
        <Card title="A" />
        <Card title="B" />
      </Shelf>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

describe('search helpers, Mark and useFindInPage', () => {
  it('matchesAll: every word, any order, ignoring case and accents', () => {
    expect(matchesAll('Apple iPhone 16 Più', 'piu apple')).toBe(true);
    expect(matchesAll('Apple iPhone 16', 'pixel')).toBe(false);
    expect(matchRanges('Più veloce, più leggero', 'piu')).toEqual([
      [0, 3],
      [12, 15],
    ]);
  });

  it('Mark wraps the matches of the query', () => {
    const { container } = render(<Mark text="Batteria più grande" query="PIU" />);
    expect([...container.querySelectorAll('mark')].map((m) => m.textContent)).toEqual(['più']);
  });

  it('useFindInPage counts the matches, fills the active one and steps through them, looping', () => {
    function Page({ query }: { query: string }) {
      const root = useRef<HTMLDivElement>(null);
      const find = useFindInPage(root, query);
      return (
        <>
          <div ref={root}>
            <p>
              <Mark text="Il prezzo è basso, il prezzo è giusto" query={query} />
            </p>
          </div>
          <output>
            {find.index + 1}/{find.count}
          </output>
          <button type="button" onClick={() => find.step(1)}>
            avanti
          </button>
        </>
      );
    }
    const { rerender, container } = render(<Page query="prezzo" />);
    expect(screen.getByText('1/2')).toBeDefined();
    const marks = () => [...container.querySelectorAll<HTMLElement>('mark')];
    expect(marks()[0]?.dataset.active).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'avanti' }));
    expect(screen.getByText('2/2')).toBeDefined();
    expect(marks()[1]?.dataset.active).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'avanti' }));
    expect(screen.getByText('1/2')).toBeDefined();
    rerender(<Page query="nulla" />);
    expect(screen.getByText('1/0')).toBeDefined();
  });
});

describe('Dock', () => {
  function Example({ onBack = () => undefined }: { onBack?: () => void }) {
    const [panel, setPanel] = useState(false);
    const [q, setQ] = useState('');
    const [index, setIndex] = useState(0);
    return (
      <Dock
        inline
        panel={panel ? <Chip>Usato</Chip> : null}
        panelLabel="Filtri"
        onDismiss={() => setPanel(false)}
      >
        <Dock.Crumbs>
          <Dock.Back onClick={onBack} />
          <Dock.Crumb icon={<svg />}>Catalogo</Dock.Crumb>
          <Dock.Crumb current animationId="crumb-phones">
            Smartphone
          </Dock.Crumb>
        </Dock.Crumbs>
        <Dock.Search
          value={q}
          onValueChange={setQ}
          placeholder="Cerca in Smartphone…"
          count={q ? 5 : undefined}
          index={index}
          onStep={(d) => setIndex((i) => (i + d + 5) % 5)}
        />
        <Dock.Actions>
          <Dock.Action label="Filtri" count={2} expanded={panel} onClick={() => setPanel(!panel)}>
            <svg />
          </Dock.Action>
        </Dock.Actions>
      </Dock>
    );
  }

  it('is a navigation landmark with a breadcrumb: back, levels, the current page', async () => {
    const onBack = vi.fn();
    render(<Example onBack={onBack} />);
    const nav = screen.getByRole('navigation', { name: 'Navigazione' });
    const crumbs = within(nav).getByRole('list', { name: 'Percorso' });
    expect(within(crumbs).getAllByRole('listitem')).toHaveLength(3);
    await userEvent.click(within(crumbs).getByRole('button', { name: 'Indietro' }));
    expect(onBack).toHaveBeenCalled();
    expect(
      within(crumbs).getByRole('button', { name: 'Smartphone' }).getAttribute('aria-current'),
    ).toBe('page');
    const { registry } = await import('@slurp-ui/motion');
    expect(registry.resolve('crumb-phones')[0]?.el).toBe(
      within(crumbs).getByRole('button', { name: 'Smartphone' }),
    );
  });

  it('search: find in page counter, Enter / Shift+Enter step, the count is announced', async () => {
    render(<Example />);
    const field = screen.getByRole('searchbox', { name: 'Cerca' });
    expect(field.getAttribute('placeholder')).toBe('Cerca in Smartphone…');
    await userEvent.type(field, 'batteria');
    expect(
      screen.getByRole('button', { name: 'Vai alla prossima corrispondenza: 1 di 5' }).textContent,
    ).toBe('1/5');
    expect(screen.getByRole('status').textContent).toBe('5 corrispondenze, 1 di 5');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('2/5')).toBeDefined();
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    expect(screen.getByText('1/5')).toBeDefined();
  });

  it('an action opens the panel above the bar, focus moves in; Escape closes and gives focus back', async () => {
    render(<Example />);
    const filters = screen.getByRole('button', { name: 'Filtri, 2 attivi' });
    await userEvent.click(filters);
    expect(filters.getAttribute('aria-expanded')).toBe('true');
    const panel = screen.getByRole('region', { name: 'Filtri' });
    expect(panel.dataset.open).toBe('true');
    expect(document.activeElement).toBe(within(panel).getByRole('button', { name: 'Usato' }));
    await userEvent.keyboard('{Escape}');
    expect(filters.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(filters);
  });

  it('on phones: earlier crumbs show their icon (named by the label), search is an action with the field in the panel', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('max-width: 640px'),
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    render(<Example />);
    const catalog = screen.getByRole('button', { name: 'Catalogo' });
    expect(catalog.dataset.icon).toBe('true');
    expect(screen.queryByRole('searchbox')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Cerca' }));
    const panel = screen.getByRole('region', { name: 'Cerca' });
    expect(within(panel).getByRole('searchbox')).toBe(document.activeElement);
  });

  it('has no axe violations with the panel open', async () => {
    const { container } = render(
      <main>
        <Example />
      </main>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Filtri, 2 attivi' }));
    await expectNoAxeViolations(container);
  });
});

describe('Settings and Filters', () => {
  it('Settings: the button grows into the panel; Tema applies at once; Lingua only when given', async () => {
    const onLanguage = vi.fn();
    const { rerender } = render(
      <SlurpProvider storageKey={null}>
        <Settings inline />
      </SlurpProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Impostazioni' }));
    const dialog = screen.getByRole('dialog', { name: 'Impostazioni' });
    expect(within(dialog).getByRole('group', { name: 'Tema' })).toBeDefined();
    expect(within(dialog).queryByRole('group', { name: 'Lingua' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Chiudi impostazioni' })).toBeDefined();
    await userEvent.click(within(dialog).getByText('Scuro'));
    expect(document.documentElement.dataset.theme).toBe('dark');

    rerender(
      <SlurpProvider storageKey={null} theme={createTheme()}>
        <Settings
          inline
          languages={[
            { value: 'it', label: 'Italiano', lang: 'it' },
            { value: 'en', label: 'English', lang: 'en' },
          ]}
          language="it"
          onLanguageChange={onLanguage}
        />
      </SlurpProvider>,
    );
    const lingua = screen.getByRole('group', { name: 'Lingua' });
    await userEvent.click(within(lingua).getByText('English'));
    expect(onLanguage).toHaveBeenCalledWith('en');
    expect(within(lingua).getByText('English').closest('label')?.getAttribute('lang')).toBe('en');
  });

  it('Settings open has no axe violations', async () => {
    const { container } = render(
      <SlurpProvider storageKey={null}>
        <main>
          <Settings inline />
        </main>
      </SlurpProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Impostazioni' }));
    await expectNoAxeViolations(container);
  });

  it('Filters: reset is off without active filters; groups are named', async () => {
    const onReset = vi.fn();
    const { rerender } = render(
      <Filters onReset={onReset} active={0}>
        <Filters.Group label="Condizione">
          <Chip>Usato</Chip>
        </Filters.Group>
      </Filters>,
    );
    const reset = screen.getByRole('button', { name: 'Azzera filtri' });
    expect((reset as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('group', { name: 'Condizione' })).toBeDefined();
    rerender(
      <Filters onReset={onReset} active={2}>
        <Filters.Group label="Condizione">
          <Chip selected>Usato</Chip>
        </Filters.Group>
      </Filters>,
    );
    await userEvent.click(reset);
    expect(onReset).toHaveBeenCalled();
  });

  it('Empty is announced politely with a single action', () => {
    render(
      <Empty
        title="Nessun risultato"
        description="Prova con meno filtri."
        action={<button type="button">Azzera filtri</button>}
      />,
    );
    expect(screen.getByRole('status').textContent).toContain('Nessun risultato');
  });
});

describe('Stage and Fact', () => {
  it('Stage takes its tint, decorative shapes are hidden', () => {
    const { container } = render(<Stage color="#ff0066">foto</Stage>);
    const stage = container.firstElementChild as HTMLElement;
    expect(stage.style.getPropertyValue('--slurp-stage-color')).toBe('#ff0066');
    expect(stage.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('Fact shows label and value', () => {
    render(<Fact label="Peso" value="170 g" />);
    expect(screen.getByText('Peso').nextElementSibling?.textContent).toBe('170 g');
  });

  it('act keeps React quiet', () => {
    act(() => undefined);
  });
});
