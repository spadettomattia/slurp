import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  AvatarGroup,
  Calendar,
  Consent,
  createTheme,
  DateField,
  ErrorSummary,
  FileDrop,
  Compare,
  Footer,
  Kbd,
  Lightbox,
  Media,
  MultiSuggest,
  NumberField,
  PinField,
  Quote,
  Reveal,
  SecretField,
  SlurpProvider,
  Tag,
  Timeline,
  Tree,
} from '../src';
import { expectNoAxeViolations } from './axe';

describe('Tag, Kbd, Quote', () => {
  it('render their content with no axe violations', async () => {
    const { container } = render(
      <main>
        <Tag tone="success">Verificato</Tag>
        <p>
          Premi <Kbd>Esc</Kbd> per chiudere.
        </p>
        <Quote author="Nome Cognome" role="Ruolo">
          Una citazione.
        </Quote>
      </main>,
    );
    expect(screen.getByText('Verificato').dataset.tone).toBe('success');
    expect(container.querySelector('kbd')?.textContent).toBe('Esc');
    expect(container.querySelector('blockquote')?.textContent).toBe('Una citazione.');
    expect(container.querySelector('figcaption')?.textContent).toContain('Nome Cognome');
    await expectNoAxeViolations(container);
  });
});

describe('Media', () => {
  it('keeps its proportions, loads lazily and shows the image once loaded', () => {
    const { container } = render(
      <Media src="/x.jpg" alt="Una veduta" ratio="4/3" caption="Didascalia" />,
    );
    const frame = container.querySelector('.slurp-media-frame') as HTMLElement;
    const img = screen.getByRole('img', { name: 'Una veduta' });
    expect(frame.style.aspectRatio).toBe('4 / 3');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(frame.hasAttribute('data-loaded')).toBe(false);
    fireEvent.load(img);
    expect(frame.hasAttribute('data-loaded')).toBe(true);
    expect(screen.getByText('Didascalia').tagName).toBe('FIGCAPTION');
  });
});

describe('Footer', () => {
  it('is the contentinfo landmark with named link lists', async () => {
    const { container } = render(
      <Footer>
        <Footer.Group title="Risorse">
          <Footer.Link href="#guide">Guide</Footer.Link>
        </Footer.Group>
        <Footer.Bottom>© Slurp</Footer.Bottom>
      </Footer>,
    );
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('list', { name: 'Risorse' })).toBeTruthy();
    expect(within(footer).getByRole('link', { name: 'Guide' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});

describe('SecretField', () => {
  it('is a password field whose toggle shows the secret', async () => {
    render(<SecretField label="Password" defaultValue="segreto" />);
    const input = screen.getByLabelText('Password');
    expect(input.getAttribute('type')).toBe('password');
    expect(input.getAttribute('autocomplete')).toBe('current-password');
    const toggle = screen.getByRole('button', { name: 'Mostra la password' });
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(toggle);
    expect(input.getAttribute('type')).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('NumberField', () => {
  it('steps with the buttons and the keys, within its bounds', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <main>
        <NumberField
          label="Persone"
          min={1}
          max={4}
          defaultValue={2}
          onValueChange={onValueChange}
        />
      </main>,
    );
    const input = screen.getByRole('spinbutton', { name: 'Persone' });
    await userEvent.click(screen.getByRole('button', { name: 'Aumenta' }));
    expect(input.getAttribute('aria-valuenow')).toBe('3');
    fireEvent.keyDown(input, { key: 'End' });
    expect(input.getAttribute('aria-valuenow')).toBe('4');
    expect(screen.getByRole('button', { name: 'Aumenta' })).toHaveProperty('disabled', true);
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input.getAttribute('aria-valuenow')).toBe('1');
    await userEvent.clear(input);
    await userEvent.type(input, '9{Enter}');
    expect(input.getAttribute('aria-valuenow')).toBe('4');
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    await expectNoAxeViolations(container);
  });
});

describe('PinField', () => {
  it('is one input that keeps digits only and reports when complete', async () => {
    const onComplete = vi.fn();
    render(<PinField label="Codice" length={4} onComplete={onComplete} />);
    const input = screen.getByLabelText('Codice');
    expect(input.getAttribute('autocomplete')).toBe('one-time-code');
    await userEvent.type(input, '12a34');
    expect((input as HTMLInputElement).value).toBe('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });
});

describe('ErrorSummary', () => {
  it('announces the errors, takes focus, and links to each field', async () => {
    render(
      <>
        <ErrorSummary
          errors={[
            { id: 'email', message: 'Scrivi un indirizzo email' },
            { id: 'name', message: 'Scrivi il nome' },
          ]}
        />
        <input id="email" aria-label="Email" />
        <input id="name" aria-label="Nome" />
      </>,
    );
    const summary = screen.getByRole('alert');
    expect(summary).toBe(document.activeElement);
    expect(within(summary).getByText('Ci sono 2 errori da correggere')).toBeTruthy();
    Element.prototype.scrollIntoView = vi.fn();
    await userEvent.click(screen.getByRole('link', { name: 'Scrivi il nome' }));
    expect(document.activeElement).toBe(screen.getByLabelText('Nome'));
  });

  it('renders nothing without errors', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('FileDrop', () => {
  it('lists chosen files and removes them', async () => {
    const onValueChange = vi.fn();
    render(<FileDrop label="Allegati" onValueChange={onValueChange} />);
    const input = screen.getByLabelText(/Allegati/) as HTMLInputElement;
    const file = new File(['ciao'], 'nota.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(screen.getByText('nota.txt')).toBeTruthy();
    expect(onValueChange).toHaveBeenLastCalledWith([file]);
    await userEvent.click(screen.getByRole('button', { name: 'Rimuovi nota.txt' }));
    expect(screen.queryByText('nota.txt')).toBeNull();
  });
});

describe('Calendar', () => {
  const theme = createTheme({ locale: 'it-IT' });

  it('is a grid of named days, moved with the keys, picking one day', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SlurpProvider theme={theme} storageKey={null}>
        <main>
          <Calendar defaultMonth="2026-12-08" onValueChange={onValueChange} />
        </main>
      </SlurpProvider>,
    );
    expect(screen.getByRole('grid', { name: /dicembre 2026/i })).toBeTruthy();
    const day = screen.getByRole('button', { name: /martedì 8 dicembre 2026/i });
    expect(day.tabIndex).toBe(0);
    act(() => day.focus());
    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /mercoledì 9 dicembre 2026/i }),
    );
    fireEvent.keyDown(document.activeElement as Element, { key: 'PageDown' });
    expect(screen.getByRole('grid', { name: /gennaio 2027/i })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /sabato 9 gennaio 2027/i }));
    expect(onValueChange).toHaveBeenLastCalledWith('2027-01-09');
    await expectNoAxeViolations(container);
  });

  it('picks a period: start, then end (in either order); disabled days do nothing', async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar range defaultMonth="2026-12-01" min="2026-12-03" onValueChange={onValueChange} />,
    );
    const day = (n: number) =>
      screen.getByRole('button', { name: new RegExp(`\\b${n} dicembre 2026`) });
    await userEvent.click(day(2));
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.click(day(11));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-12-11', end: null });
    await userEvent.click(day(8));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-12-08', end: '2026-12-11' });
  });
});

describe('DateField', () => {
  it('shows the date in words, opens a calendar and closes once a day is picked', async () => {
    render(
      <SlurpProvider theme={createTheme({ locale: 'it-IT' })} storageKey={null}>
        <DateField label="Arrivo" defaultValue="2026-12-08" name="arrivo" />
      </SlurpProvider>,
    );
    const trigger = screen.getByRole('button', { name: 'Arrivo 8 dicembre 2026' });
    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(screen.getByRole('button', { name: /venerdì 11 dicembre 2026/i }));
    expect(screen.getByRole('button', { name: 'Arrivo 11 dicembre 2026' })).toBeTruthy();
    expect((document.querySelector('input[name="arrivo"]') as HTMLInputElement | null)?.value).toBe(
      '2026-12-11',
    );
  });
});

describe('MultiSuggest', () => {
  const options = [
    { value: 'r', label: 'Rosso' },
    { value: 'v', label: 'Verde' },
    { value: 'b', label: 'Blu' },
  ];

  it('keeps the list open while picking, shows removable tags and submits each value', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <main>
        <MultiSuggest
          label="Colori"
          name="colori"
          options={options}
          onValueChange={onValueChange}
        />
      </main>,
    );
    const input = screen.getByRole('combobox', { name: 'Colori' });
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: /Rosso/ }));
    await userEvent.click(screen.getByRole('option', { name: /Blu/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(['r', 'b']);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true');
    expect(screen.getByRole('button', { name: 'Rimuovi Rosso' })).toBeTruthy();
    expect(
      [...container.querySelectorAll<HTMLInputElement>('input[type="hidden"]')].map((i) => i.value),
    ).toEqual(['r', 'b']);
    await userEvent.keyboard('{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['r']);
    await userEvent.click(screen.getByRole('button', { name: 'Rimuovi Rosso' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    await expectNoAxeViolations(container);
  });
});

describe('Tree, Compare, Lightbox', () => {
  it('Tree: one tab stop, Right opens, Left closes, Enter chooses', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <main>
        <Tree
          label="File"
          onValueChange={onValueChange}
          items={[
            { id: 'a', label: 'Cartella', children: [{ id: 'a1', label: 'Nota' }] },
            { id: 'b', label: 'Altro' },
          ]}
        />
      </main>,
    );
    const folder = screen.getByRole('treeitem', { name: 'Cartella' });
    expect(folder.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getAllByRole('treeitem').filter((i) => i.tabIndex === 0)).toHaveLength(1);
    act(() => folder.focus());
    fireEvent.keyDown(folder, { key: 'ArrowRight' });
    expect(folder.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(folder, { key: 'ArrowDown' });
    const note = screen.getByRole('treeitem', { name: 'Nota' });
    expect(document.activeElement).toBe(note);
    expect(note.getAttribute('aria-level')).toBe('2');
    fireEvent.keyDown(note, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith('a1');
    fireEvent.keyDown(note, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(folder);
    fireEvent.keyDown(folder, { key: 'ArrowLeft' });
    expect(folder.getAttribute('aria-expanded')).toBe('false');
    await expectNoAxeViolations(container);
  });

  it('Compare is a named slider that sets how much of the first picture shows', async () => {
    const { container } = render(
      <main>
        <Compare
          before={<img src="/a.jpg" alt="Prima" />}
          after={<img src="/b.jpg" alt="Dopo" />}
        />
      </main>,
    );
    const slider = screen.getByRole('slider', { name: 'Confronta prima e dopo' });
    fireEvent.change(slider, { target: { value: '80' } });
    expect(
      (container.querySelector('.slurp-compare') as HTMLElement).style.getPropertyValue(
        '--slurp-compare',
      ),
    ).toBe('80%');
    await expectNoAxeViolations(container);
  });

  it('Lightbox shows one picture, moves through the set and wraps', async () => {
    render(
      <Lightbox
        open
        images={[
          { src: '/1.jpg', alt: 'Uno' },
          { src: '/2.jpg', alt: 'Due' },
        ]}
      />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Uno' });
    expect(within(dialog).getByRole('img', { name: 'Uno' })).toBeTruthy();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Immagine successiva' }));
    expect(screen.getByRole('dialog', { name: 'Due' })).toBeTruthy();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Immagine successiva' }));
    expect(screen.getByRole('dialog', { name: 'Uno' })).toBeTruthy();
  });
});

describe('AvatarGroup, Timeline, Consent', () => {
  it('AvatarGroup shows the first people and names the rest', async () => {
    const people = ['Anna Rossi', 'Luca Bianchi', 'Sara Verdi', 'Marco Neri'].map((name) => ({
      name,
    }));
    const { container } = render(
      <main>
        <AvatarGroup label="Partecipanti" people={people} max={2} />
      </main>,
    );
    const group = screen.getByRole('group', { name: 'Partecipanti' });
    expect(within(group).getAllByRole('img')).toHaveLength(3);
    expect(within(group).getByRole('img', { name: 'altre 2 persone' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('Timeline is an ordered list of events with machine-readable dates', async () => {
    const { container } = render(
      <main>
        <Timeline
          latestFirst
          items={[
            { title: 'Consegnato', time: '12 marzo', dateTime: '2026-03-12' },
            { title: 'Spedito', description: 'In viaggio' },
          ]}
        />
      </main>,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe('2026-03-12');
    expect(container.querySelector('[data-latest]')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('Consent is a named region whose buttons report the answer; closed it renders nothing', async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    const { container, rerender } = render(
      <main>
        <Consent
          title="Cookie"
          onAccept={onAccept}
          onReject={onReject}
          onCustomize={() => undefined}
        >
          Usiamo cookie tecnici.
        </Consent>
      </main>,
    );
    const region = screen.getByRole('region', { name: 'Preferenze sui cookie' });
    await userEvent.click(within(region).getByRole('button', { name: 'Rifiuta' }));
    await userEvent.click(within(region).getByRole('button', { name: 'Accetta' }));
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(within(region).getByRole('button', { name: 'Personalizza' })).toBeTruthy();
    await expectNoAxeViolations(container);
    rerender(
      <main>
        <Consent open={false}>x</Consent>
      </main>,
    );
    expect(screen.queryByRole('region')).toBeNull();
  });
});

describe('Reveal', () => {
  type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
  let callback: Callback = () => undefined;
  const real = globalThis.IntersectionObserver;
  const realMatch = globalThis.matchMedia;

  function install(reduced: boolean) {
    globalThis.IntersectionObserver = class {
      constructor(cb: Callback) {
        callback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    globalThis.matchMedia = ((q: string) => ({
      matches: reduced && q.includes('reduce'),
    })) as unknown as typeof matchMedia;
  }
  function restore() {
    globalThis.IntersectionObserver = real;
    globalThis.matchMedia = realMatch;
  }

  it('renders the sentence whole and lights its words in order as they cross the line', async () => {
    install(false);
    const { container } = render(
      <main>
        <Reveal as="h2">Una frase di tre parole</Reveal>
      </main>,
    );
    const heading = screen.getByRole('heading', { name: 'Una frase di tre parole' });
    expect(heading.hasAttribute('data-armed')).toBe(true);
    const words = [...container.querySelectorAll<HTMLElement>('.slurp-reveal-word')];
    expect(words.map((w) => w.textContent)).toEqual(['Una', 'frase', 'di', 'tre', 'parole']);
    act(() =>
      callback([
        { target: words[1], isIntersecting: true },
        { target: words[0], isIntersecting: true },
      ]),
    );
    expect(words.map((w) => w.hasAttribute('data-lit'))).toEqual([true, true, false, false, false]);
    expect(words[0]?.style.transitionDelay).toBe('0ms');
    expect(words[1]?.style.transitionDelay).toBe('30ms');
    await expectNoAxeViolations(container);
    restore();
  });

  it('stays lit, with nothing armed, when motion is reduced', () => {
    install(true);
    const { container } = render(<Reveal>Una frase</Reveal>);
    expect(container.querySelector('.slurp-reveal')?.hasAttribute('data-armed')).toBe(false);
    restore();
  });
});
