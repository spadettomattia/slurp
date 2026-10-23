import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ComponentType } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Avatar,
  Bloom,
  Bubble,
  Button,
  Checkbox,
  Chip,
  Choice,
  Count,
  createTheme,
  Dialog,
  Field,
  Fold,
  Hint,
  Menu,
  MenuItem,
  Notice,
  Placeholder,
  Progress,
  Radio,
  RadioGroup,
  Range,
  Search,
  Segmented,
  Sheet,
  SlurpProvider,
  Swatch,
  SwatchGroup,
  Switch,
  Tabs,
  ToastProvider,
  useToast,
  VisuallyHidden,
} from '../src';
import { expectNoAxeViolations } from './axe';

afterEach(() => {
  vi.useRealTimers();
});

type Any = ComponentType<Record<string, unknown>>;
const OPTIONS = [
  { value: 'grid', label: 'Griglia' },
  { value: 'list', label: 'Lista' },
  { value: 'map', label: 'Mappa' },
];

/** [name, component, root class, required props, renders an element that supports `as`]. */
const components: [string, Any, string, Record<string, unknown>][] = [
  ['Button', Button as Any, 'slurp-button', { children: 'Salva' }],
  ['Bubble', Bubble as Any, 'slurp-bubble', { label: 'Cerca', children: '?' }],
  ['Chip', Chip as Any, 'slurp-chip', { children: 'Usato' }],
  ['Count', Count as Any, 'slurp-count', { value: 3 }],
  ['Avatar', Avatar as Any, 'slurp-avatar', { name: 'Ada Lovelace' }],
  ['Swatch', Swatch as Any, 'slurp-swatch', { color: '#123456', label: 'Blu notte' }],
  [
    'SwatchGroup',
    SwatchGroup as Any,
    'slurp-swatch-group',
    { label: 'Colore', options: [{ value: 'a', color: '#123456', label: 'Blu' }] },
  ],
  ['Segmented', Segmented as Any, 'slurp-segmented', { label: 'Vista', options: OPTIONS }],
  ['Progress', Progress as Any, 'slurp-progress', { label: 'Caricamento', value: 40 }],
  ['Placeholder', Placeholder as Any, 'slurp-placeholder', {}],
  ['Notice', Notice as Any, 'slurp-notice', { children: 'Testo' }],
  ['Field', Field as Any, 'slurp-field', { label: 'Nome' }],
  ['Search', Search as Any, 'slurp-search', {}],
  ['Checkbox', Checkbox as Any, 'slurp-checkbox', { children: 'Accetto' }],
  ['Radio', Radio as Any, 'slurp-radio', { value: 'a', children: 'A' }],
  ['RadioGroup', RadioGroup as Any, 'slurp-radio-group', { label: 'Taglia' }],
  ['Switch', Switch as Any, 'slurp-switch', { children: 'Notifiche' }],
  ['Range', Range as Any, 'slurp-range', { label: 'Prezzo massimo' }],
  [
    'Tabs',
    Tabs as Any,
    'slurp-tabs',
    { label: 'Dettagli', items: [{ value: 'a', label: 'A', content: 'x' }] },
  ],
  ['Fold', Fold as Any, 'slurp-fold', { summary: 'Spedizione', children: 'In 24 ore' }],
  ['Bloom', Bloom as Any, 'slurp-bloom', { trigger: 'Apri', children: 'Pannello' }],
  ['Choice', Choice as Any, 'slurp-choice', { label: 'Ordina per', options: OPTIONS }],
];

describe.each(components)('%s (shared API)', (_name, Component, rootClass, required) => {
  it('renders one root with its class, forwarding className, style, ref and unknown props', () => {
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
    const root = container.firstElementChild as HTMLElement;
    expect(container.children).toHaveLength(1);
    expect(root.classList.contains(rootClass)).toBe(true);
    expect(root.classList.contains('mine')).toBe(true);
    expect(root.style.marginTop).toBe('3px');
    expect(root.dataset.testid).toBe('root');
    expect(ref.current).toBe(root);
  });

  it('renders as another element with `as`', () => {
    const { container } = render(<Component {...required} as="section" />);
    expect(container.firstElementChild?.tagName).toBe('SECTION');
  });

  it('takes theme defaults and per-instance css', () => {
    const theme = createTheme({ components: { [_name]: { css: { root: { mt: 6 } } } } });
    const { container } = render(
      <SlurpProvider theme={theme} storageKey={null}>
        <Component {...required} css={{ p: 2 }} />
      </SlurpProvider>,
    );
    const root = container.querySelector(`.${rootClass}`) as HTMLElement;
    expect(
      [...root.classList].filter((c) => c.startsWith('slurp-x')).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it('registers for motion with animationId', async () => {
    const { registry } = await import('@slurp-ui/motion');
    const { container, unmount } = render(
      <Component {...required} animationId={`${_name}-motion`} />,
    );
    expect(registry.resolve(`${_name}-motion`)[0]?.el).toBe(container.firstElementChild);
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

describe('Button and Bubble', () => {
  it('Button is type=button, a link with href, with decorative icons', () => {
    render(
      <>
        <Button icon={<svg />}>Salva</Button>
        <Button href="/carrello">Vai al carrello</Button>
      </>,
    );
    const button = screen.getByRole('button', { name: 'Salva' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.querySelector('[aria-hidden="true"] svg')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Vai al carrello' }).getAttribute('href')).toBe(
      '/carrello',
    );
  });

  it('Bubble is named by its label', () => {
    render(<Bubble label="Impostazioni">⚙</Bubble>);
    expect(screen.getByRole('button', { name: 'Impostazioni' })).toBeDefined();
  });
});

describe('Chip', () => {
  it('toggles aria-pressed and shows a check when selected', async () => {
    const onChange = vi.fn();
    render(<Chip onSelectedChange={onChange}>Usato</Chip>);
    const chip = screen.getByRole('button', { name: 'Usato' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(chip.querySelector('svg')).not.toBeNull();
    chip.focus();
    await userEvent.keyboard(' ');
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    expect(onChange.mock.calls).toEqual([[true], [false]]);
  });
});

describe('Segmented and SwatchGroup (roving focus)', () => {
  it('Segmented: one tab stop, arrows move and select, the selected one has a check', async () => {
    const onChange = vi.fn();
    render(<Segmented label="Vista" options={OPTIONS} onValueChange={onChange} />);
    const [grid, list, map] = screen.getAllByRole('radio');
    expect(screen.getByRole('radiogroup', { name: 'Vista' })).toBeDefined();
    expect([grid, list, map].map((r) => r?.tabIndex)).toEqual([0, -1, -1]);
    await userEvent.tab();
    expect(document.activeElement).toBe(grid);
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(list);
    expect(list?.getAttribute('aria-checked')).toBe('true');
    expect(list?.querySelector('svg')).not.toBeNull();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(document.activeElement).toBe(grid);
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(map);
    expect(onChange).toHaveBeenLastCalledWith('map');
  });

  it('SwatchGroup: arrows select, the selected swatch is aria-checked', async () => {
    render(
      <SwatchGroup
        label="Colore"
        defaultValue="b"
        options={[
          { value: 'a', color: '#111', label: 'Nero' },
          { value: 'b', color: '#eee', label: 'Bianco' },
        ]}
      />,
    );
    const white = screen.getByRole('radio', { name: 'Bianco' });
    expect(white.tabIndex).toBe(0);
    white.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Nero' }).getAttribute('aria-checked')).toBe('true');
  });
});

describe('Form controls', () => {
  it('Field: label, hint and error are wired; typing reports the value', async () => {
    const onChange = vi.fn();
    render(
      <Field
        label="Email"
        hint="Ti scriviamo solo per l'ordine"
        error="Indirizzo non valido"
        onValueChange={onChange}
      />,
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(
      screen.getByText('Indirizzo non valido').closest('p')?.querySelector('svg'),
    ).not.toBeNull();
    await userEvent.type(input, 'a@b');
    expect(onChange).toHaveBeenLastCalledWith('a@b', expect.anything());
  });

  it('Field: multiline renders a textarea; input attributes reach the control, others the root', () => {
    const { container } = render(<Field label="Note" multiline name="note" required data-x="1" />);
    const area = screen.getByLabelText('Note');
    expect(area.tagName).toBe('TEXTAREA');
    expect(area.getAttribute('name')).toBe('note');
    expect((area as HTMLTextAreaElement).required).toBe(true);
    expect((container.firstElementChild as HTMLElement).dataset.x).toBe('1');
  });

  it('Search: Enter searches, the count is announced, clear empties and refocuses', async () => {
    const onSearch = vi.fn();
    render(
      <Search count={4} onSearch={onSearch} labels={{ placeholder: 'Cerca in Smartphone…' }} />,
    );
    const box = screen.getByRole('searchbox', { name: 'Cerca' });
    expect(box.getAttribute('placeholder')).toBe('Cerca in Smartphone…');
    await userEvent.type(box, 'apple{Enter}');
    expect(onSearch).toHaveBeenCalledWith('apple');
    expect(screen.getByRole('status').textContent).toBe('4 risultati');
    await userEvent.click(screen.getByRole('button', { name: 'Cancella la ricerca' }));
    expect((box as HTMLInputElement).value).toBe('');
    expect(document.activeElement).toBe(box);
  });

  it('Checkbox: Space toggles; indeterminate is set on the input', async () => {
    const { rerender } = render(<Checkbox>Accetto</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Accetto' }) as HTMLInputElement;
    box.focus();
    await userEvent.keyboard(' ');
    expect(box.checked).toBe(true);
    rerender(<Checkbox indeterminate>Accetto</Checkbox>);
    expect(box.indeterminate).toBe(true);
  });

  it('RadioGroup: the legend names the group, a click selects', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Taglia" defaultValue="m" onValueChange={onChange}>
        <Radio value="s">S</Radio>
        <Radio value="m">M</Radio>
        <Radio value="l">L</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('group', { name: 'Taglia' })).toBeDefined();
    expect((screen.getByRole('radio', { name: 'M' }) as HTMLInputElement).checked).toBe(true);
    await userEvent.click(screen.getByText('L'));
    expect(onChange).toHaveBeenCalledWith('l');
    expect((screen.getByRole('radio', { name: 'L' }) as HTMLInputElement).checked).toBe(true);
    const names = screen.getAllByRole('radio').map((r) => r.getAttribute('name'));
    expect(new Set(names).size).toBe(1);
  });

  it('Switch: role switch, Space toggles, a check marks on', async () => {
    const { container } = render(<Switch defaultChecked={false}>Notifiche</Switch>);
    const sw = screen.getByRole('switch', { name: 'Notifiche' }) as HTMLInputElement;
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw.checked).toBe(true);
    expect(container.querySelector('.slurp-switch-thumb svg')).not.toBeNull();
  });

  it('Range: labelled slider with a value text', () => {
    const onChange = vi.fn();
    render(
      <Range
        label="Prezzo massimo"
        min={0}
        max={2000}
        step={50}
        defaultValue={500}
        formatValue={(v) => `${v} €`}
        onValueChange={onChange}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Prezzo massimo' });
    expect(slider.getAttribute('aria-valuetext')).toBe('500 €');
    fireEvent.change(slider, { target: { value: '750' } });
    expect(onChange).toHaveBeenCalledWith(750);
    expect(screen.getByText('750 €')).toBeDefined();
  });
});

describe('Disclosure', () => {
  const items = [
    { value: 'desc', label: 'Descrizione', content: 'Testo' },
    { value: 'spec', label: 'Specifiche', content: 'Tabella' },
    { value: 'rev', label: 'Recensioni', content: 'Voti', disabled: true },
  ];

  it('Tabs: arrows move and select, skipping disabled tabs; the panel is labelled by its tab', async () => {
    render(<Tabs label="Dettagli" items={items} />);
    const [desc, spec] = screen.getAllByRole('tab');
    expect(screen.getByRole('tabpanel', { name: 'Descrizione' }).textContent).toBe('Testo');
    desc?.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(spec);
    expect(screen.getByRole('tabpanel', { name: 'Specifiche' }).textContent).toBe('Tabella');
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(desc);
  });

  it('Fold: the button controls a region that is inert while closed', async () => {
    render(<Fold summary="Spedizione">In 24 ore</Fold>);
    const button = screen.getByRole('button', { name: 'Spedizione' });
    const region = document.getElementById(
      button.getAttribute('aria-controls') ?? '',
    ) as HTMLElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(region.hasAttribute('inert')).toBe(true);
    await userEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(region.hasAttribute('inert')).toBe(false);
    expect(button.closest('h3')).not.toBeNull();
  });

  it('Hint: shows on focus, describes the trigger, hides on Escape', async () => {
    render(
      <Hint content="Aggiungi ai preferiti">
        <button type="button">♥</button>
      </Hint>,
    );
    const trigger = screen.getByRole('button');
    const tip = screen.getByRole('tooltip', { hidden: true });
    expect(trigger.getAttribute('aria-describedby')).toBe(tip.id);
    expect(tip.dataset.open).toBeUndefined();
    act(() => trigger.focus());
    await act(() => new Promise((r) => setTimeout(r, 10)));
    expect(tip.dataset.open).toBe('true');
    await userEvent.keyboard('{Escape}');
    expect(tip.dataset.open).toBeUndefined();
  });
});

describe('Bloom, Choice and Menu', () => {
  it('Bloom: the trigger opens the panel and moves focus in; Escape closes and gives focus back', async () => {
    render(
      <Bloom trigger="Filtri" panelLabel="Filtri">
        <button type="button">Usato</button>
      </Bloom>,
    );
    const trigger = screen.getByRole('button', { name: 'Filtri' });
    const panel = screen.getByRole('dialog', { hidden: true });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(panel.hasAttribute('inert')).toBe(true);
    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Usato' }));
    expect(trigger.closest('.slurp-bloom')?.getAttribute('data-phase')).toBe('open');
    await userEvent.keyboard('{Escape}');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(trigger.closest('.slurp-bloom')?.getAttribute('data-phase')).toBe('closing');
  });

  it('Bloom: a press outside or Tab out closes it', async () => {
    render(
      <>
        <Bloom trigger="Filtri">
          <button type="button">Usato</button>
        </Bloom>
        <button type="button">Fuori</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'Filtri' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Fuori' }));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(trigger);
    await userEvent.tab();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('Choice: ArrowDown opens on the selected option, arrows move, Enter chooses and closes', async () => {
    const onChange = vi.fn();
    render(
      <Choice
        label="Ordina per"
        options={OPTIONS}
        defaultValue="list"
        onValueChange={onChange}
        name="sort"
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Ordina per Lista' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox', { name: 'Ordina per' });
    expect(document.activeElement).toBe(within(listbox).getByRole('option', { name: 'Lista' }));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('map');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(screen.getByRole('button', { name: 'Ordina per Mappa' })).toBe(trigger);
    expect((document.querySelector('input[name="sort"]') as HTMLInputElement).value).toBe('map');
  });

  it('Menu: items are menuitems, arrows loop, Enter runs the action and closes', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <Menu trigger="Azioni">
        <MenuItem onSelect={onEdit}>Modifica</MenuItem>
        <MenuItem onSelect={onDelete} tone="danger">
          Elimina
        </MenuItem>
      </Menu>,
    );
    const trigger = screen.getByRole('button', { name: 'Azioni' });
    await userEvent.click(trigger);
    const [edit, del] = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(edit);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(del);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(edit);
    await userEvent.keyboard('{Enter}');
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('Choice, Menu and an open Bloom have no axe violations', async () => {
    const { container } = render(
      <main>
        <Choice label="Ordina per" options={OPTIONS} defaultValue="grid" />
        <Menu trigger="Azioni" defaultOpen>
          <MenuItem>Modifica</MenuItem>
        </Menu>
        <Bloom trigger="Filtri" defaultOpen panelLabel="Filtri">
          <Chip>Usato</Chip>
        </Bloom>
      </main>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Dialog and Sheet', () => {
  function Example({ Component = Dialog }: { Component?: typeof Dialog }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Elimina account</Button>
        <Component
          open={open}
          onOpenChange={setOpen}
          title="Eliminare l'account?"
          description="L'operazione non si può annullare."
          actions={<Button onClick={() => setOpen(false)}>Elimina</Button>}
        >
          <p>Tutti i dati verranno rimossi.</p>
        </Component>
      </>
    );
  }

  it.each([
    ['Dialog', Dialog],
    ['Sheet', Sheet],
  ])(
    '%s: opens named by its title, closes with its button and gives focus back',
    async (_n, Component) => {
      render(<Example Component={Component as typeof Dialog} />);
      const opener = screen.getByRole('button', { name: 'Elimina account' });
      await userEvent.click(opener);
      const dialog = screen.getByRole('dialog', { name: "Eliminare l'account?" });
      expect(dialog.hasAttribute('open')).toBe(true);
      expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
      await userEvent.click(within(dialog).getByRole('button', { name: 'Chiudi' }));
      expect(dialog.hasAttribute('open')).toBe(false);
      expect(document.activeElement).toBe(opener);
    },
  );

  it('Escape (cancel) closes through the state', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog open title="Titolo" onOpenChange={onOpenChange} />);
    const dialog = screen.getByRole('dialog', { name: 'Titolo' });
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has no axe violations when open', async () => {
    const { container } = render(
      <main>
        <Dialog defaultOpen title="Titolo" actions={<Button>Ok</Button>}>
          <p>Testo</p>
        </Dialog>
      </main>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Feedback', () => {
  it('Notice: role status, the tone word as title, an icon and a close button', async () => {
    const onDismiss = vi.fn();
    render(
      <Notice tone="warning" onDismiss={onDismiss}>
        Disponibilità limitata
      </Notice>,
    );
    const notice = screen.getByRole('status', { name: 'Attenzione' });
    expect(notice.querySelector('svg')).not.toBeNull();
    await userEvent.click(within(notice).getByRole('button', { name: 'Chiudi avviso' }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('Toast: shown in a polite region, closes by itself, pauses while hovered', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    function Trigger() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => toast({ title: 'Aggiunto al carrello', tone: 'success', duration: 3000 })}
        >
          Aggiungi
        </button>
      );
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    const region = screen.getByRole('region', { name: 'Notifiche' });
    expect(region.querySelector('[aria-live="polite"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Aggiungi' }));
    const toast = screen.getByText('Aggiunto al carrello').closest('li') as HTMLElement;
    fireEvent.pointerEnter(toast);
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(screen.queryByText('Aggiunto al carrello')).not.toBeNull();
    fireEvent.pointerLeave(toast);
    await act(() => vi.advanceTimersByTimeAsync(3100));
    expect(screen.queryByText('Aggiunto al carrello')).toBeNull();
  });

  it('useToast needs a provider', () => {
    function Lonely() {
      useToast();
      return null;
    }
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Lonely />)).toThrow(/ToastProvider/);
  });

  it('Progress: value or indeterminate, bar or ring', () => {
    render(
      <>
        <Progress label="Caricamento" value={30} />
        <Progress label="Attesa" shape="ring" />
      </>,
    );
    const [bar, ring] = screen.getAllByRole('progressbar');
    expect(bar?.getAttribute('aria-valuenow')).toBe('30');
    expect(bar?.getAttribute('aria-valuetext')).toBe('30%');
    expect(ring?.hasAttribute('aria-valuenow')).toBe(false);
    expect(ring?.querySelector('svg')).not.toBeNull();
  });

  it('Placeholder is hidden from assistive tech', () => {
    const { container } = render(<Placeholder shape="circle" />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('Display', () => {
  it('Count: shows max+ and speaks its label', () => {
    render(
      <button type="button">
        Filtri <Count value={120} label={(n) => `${n} attivi`} />
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Filtri 120 attivi' })).toBeDefined();
    expect(screen.getByText('99+').getAttribute('aria-hidden')).toBe('true');
  });

  it('Avatar: initials when there is no photo, and after a broken one', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).textContent).toBe('AL');
    rerender(<Avatar name="Ada Lovelace" src="/ada.jpg" />);
    const img = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(img.tagName).toBe('IMG');
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).textContent).toBe('AL');
  });

  it('VisuallyHidden keeps text for screen readers', () => {
    render(
      <button type="button">
        ♥<VisuallyHidden>Preferiti</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: '♥Preferiti' })).toBeDefined();
  });
});
