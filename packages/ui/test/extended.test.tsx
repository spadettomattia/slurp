import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  Carousel,
  createTheme,
  pageItems,
  Pages,
  Rating,
  SlurpProvider,
  Steps,
  Suggest,
  Table,
  type TableColumn,
} from '../src';
import { expectNoAxeViolations } from './axe';

type Any = ComponentType<Record<string, unknown>>;

const PHONES = [
  { value: 'iphone', label: 'iPhone 17', description: 'Apple' },
  { value: 'pixel', label: 'Pixel 10', description: 'Google' },
  { value: 'galaxy', label: 'Galaxy S26', description: 'Samsung' },
  { value: 'fairphone', label: 'Fairphone 6', description: 'Fairphone', disabled: true },
  { value: 'xperia', label: 'Xperia 1', description: 'Sony' },
];

const STEPS = [
  { value: 'model', label: 'Modello' },
  { value: 'color', label: 'Colore' },
  { value: 'storage', label: 'Memoria' },
  { value: 'summary', label: 'Riepilogo' },
];

interface Phone {
  name: string;
  brand: string;
  price: number;
}
const ROWS: Phone[] = [
  { name: 'Pixel 10', brand: 'Google', price: 899 },
  { name: 'iPhone 17', brand: 'Apple', price: 979 },
  { name: 'Galaxy S26', brand: 'Samsung', price: 929 },
];
const COLUMNS: TableColumn<Phone>[] = [
  { key: 'name', header: 'Modello', rowHeader: true, sortable: true },
  { key: 'brand', header: 'Marca' },
  {
    key: 'price',
    header: 'Prezzo',
    align: 'end',
    sortable: true,
    cell: (r) => `${r.price} €`,
  },
];

/** [name, component, root class, required props]. */
const components: [string, Any, string, Record<string, unknown>][] = [
  ['Suggest', Suggest as Any, 'slurp-suggest', { label: 'Telefono', options: PHONES }],
  ['Pages', Pages as Any, 'slurp-pages', { count: 12 }],
  ['Steps', Steps as Any, 'slurp-steps', { steps: STEPS }],
  ['Rating', Rating as Any, 'slurp-rating', { label: 'Il tuo voto' }],
  ['Table', Table as Any, 'slurp-table', { caption: 'Telefoni', columns: COLUMNS, rows: ROWS }],
  [
    'Carousel',
    Carousel as Any,
    'slurp-carousel',
    { label: 'Foto', children: ['Fronte', 'Retro', 'Lato'] },
  ],
];

describe.each(components)('%s (shared API)', (name, Component, rootClass, required) => {
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

  it('takes theme css and per-instance css', () => {
    const theme = createTheme({ components: { [name]: { css: { root: { mt: 6 } } } } });
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
      <Component {...required} animationId={`${name}-motion`} />,
    );
    expect(registry.resolve(`${name}-motion`)[0]?.el).toBe(container.firstElementChild);
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

describe('Suggest', () => {
  it('is a combobox: typing filters (accent- and case-insensitive, label or description) and announces the count', async () => {
    render(<Suggest label="Telefono" options={PHONES} />);
    const input = screen.getByRole('combobox', { name: 'Telefono' });
    expect(input.getAttribute('aria-expanded')).toBe('false');
    await userEvent.type(input, 'GOOG');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    const listbox = screen.getByRole('listbox', { name: 'Telefono' });
    expect(
      within(listbox)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['Pixel 10Google']);
    expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    expect(screen.getByRole('status').textContent).toBe('1 suggerimento');
    expect(listbox.querySelector('mark')?.textContent).toBe('Goog');
  });

  it('arrows move the active option (skipping disabled ones, focus stays in the field), Enter chooses', async () => {
    const onChange = vi.fn();
    render(<Suggest label="Telefono" options={PHONES} onValueChange={onChange} name="phone" />);
    const input = screen.getByRole('combobox');
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(input.getAttribute('aria-activedescendant')).toBe(options[0]?.id);
    expect(options[0]?.getAttribute('aria-selected')).toBe('true');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    // Fairphone (disabled) is skipped.
    expect(input.getAttribute('aria-activedescendant')).toBe(options[4]?.id);
    expect(document.activeElement).toBe(input);
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('xperia');
    expect((input as HTMLInputElement).value).toBe('Xperia 1');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect((document.querySelector('input[name="phone"]') as HTMLInputElement).value).toBe(
      'xperia',
    );
  });

  it('a press on an option chooses it; editing the text clears the choice', async () => {
    const onChange = vi.fn();
    render(<Suggest label="Telefono" options={PHONES} onValueChange={onChange} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'gal');
    await userEvent.click(screen.getByRole('option', { name: /Galaxy/ }));
    expect(onChange).toHaveBeenLastCalledWith('galaxy');
    expect((input as HTMLInputElement).value).toBe('Galaxy S26');
    await userEvent.type(input, 'x');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('with the chosen text in the field every option is offered again, the chosen one checked', async () => {
    render(<Suggest label="Telefono" options={PHONES} defaultValue="pixel" />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('Pixel 10');
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1]?.id);
    expect(options[1]?.hasAttribute('data-chosen')).toBe(true);
  });

  it('Escape closes, a second Escape clears; a press outside closes', async () => {
    render(
      <>
        <Suggest label="Telefono" options={PHONES} />
        <button type="button">Fuori</button>
      </>,
    );
    const input = screen.getByRole('combobox') as HTMLInputElement;
    await userEvent.type(input, 'pix');
    await userEvent.keyboard('{Escape}');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.value).toBe('pix');
    await userEvent.keyboard('{Escape}');
    expect(input.value).toBe('');
    await userEvent.type(input, 'pix');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(screen.getByRole('button', { name: 'Fuori' }));
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('says when nothing matches, and leaves filtering to the app with filter={false}', async () => {
    const { rerender } = render(<Suggest label="Telefono" options={PHONES} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'nokia');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('Nessun suggerimento');
    rerender(<Suggest label="Telefono" options={PHONES.slice(0, 2)} filter={false} />);
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('openOnFocus lists the suggestions on focus, limit caps them; an open list has no axe violations', async () => {
    const { container } = render(
      <main>
        <Suggest label="Telefono" options={PHONES} openOnFocus limit={2} hint="Scegli un modello" />
      </main>,
    );
    act(() => screen.getByRole('combobox').focus());
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});

describe('Pages', () => {
  it('pageItems keeps a constant length and never hides a single page behind a gap', () => {
    expect(pageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageItems(1, 10)).toEqual([1, 2, 3, 4, 5, 'gap', 10]);
    expect(pageItems(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
    expect(pageItems(10, 10)).toEqual([1, 'gap', 6, 7, 8, 9, 10]);
    expect(pageItems(4, 10)).toEqual([1, 2, 3, 4, 5, 'gap', 10]);
    expect(pageItems(6, 20, 2, 2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 'gap', 19, 20]);
    expect(pageItems(10, 20, 2, 2)).toEqual([1, 2, 'gap', 8, 9, 10, 11, 12, 'gap', 19, 20]);
    for (let p = 1; p <= 30; p++) expect(pageItems(p, 30)).toHaveLength(7);
  });

  it('marks the current page, moves with previous / next and the numbers, disables the ends', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [page, setPage] = useState(1);
      return (
        <Pages
          count={10}
          page={page}
          onPageChange={(p) => {
            onChange(p);
            setPage(p);
          }}
        />
      );
    }
    render(<Controlled />);
    const nav = screen.getByRole('navigation', { name: 'Pagine' });
    expect(within(nav).getByRole('button', { name: 'Pagina 1' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(within(nav).getByRole('button', { name: 'Pagina precedente' })).toHaveProperty(
      'disabled',
      true,
    );
    await userEvent.click(within(nav).getByRole('button', { name: 'Pagina successiva' }));
    expect(onChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(within(nav).getByRole('button', { name: 'Pagina 10' }));
    expect(onChange).toHaveBeenLastCalledWith(10);
    expect(within(nav).getByRole('button', { name: 'Pagina successiva' })).toHaveProperty(
      'disabled',
      true,
    );
    expect(nav.textContent).toContain('10 di 10');
  });

  it('with href the items are links; the unavailable end is a disabled link without href', () => {
    render(<Pages count={3} defaultPage={1} href={(p) => `?pagina=${p}`} />);
    expect(screen.getByRole('link', { name: 'Pagina 2' }).getAttribute('href')).toBe('?pagina=2');
    expect(screen.getByRole('link', { name: 'Pagina 1' }).getAttribute('aria-current')).toBe(
      'page',
    );
    const previous = screen.getByRole('link', { name: 'Pagina precedente' });
    expect(previous.hasAttribute('href')).toBe(false);
    expect(previous.getAttribute('aria-disabled')).toBe('true');
  });

  it('clamps the page to the count', () => {
    render(<Pages count={3} page={9} />);
    expect(screen.getByRole('button', { name: 'Pagina 3' }).getAttribute('aria-current')).toBe(
      'page',
    );
  });
});

describe('Steps', () => {
  it('marks done, current and upcoming steps with shape and words; done steps can be reopened', async () => {
    const onChange = vi.fn();
    render(<Steps steps={STEPS} defaultValue="storage" onValueChange={onChange} />);
    const nav = screen.getByRole('navigation', { name: 'Passaggi' });
    const items = within(nav).getAllByRole('listitem');
    expect(items.map((li) => li.dataset.state)).toEqual(['done', 'done', 'current', 'upcoming']);
    expect(items[2]?.getAttribute('aria-current')).toBe('step');
    expect(items[0]?.querySelector('svg')).not.toBeNull();
    const back = within(nav).getByRole('button', { name: 'Colore, completato' });
    expect(within(nav).getAllByRole('button')).toHaveLength(2);
    await userEvent.click(back);
    expect(onChange).toHaveBeenCalledWith('color');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
  });

  it('navigable="all" opens every step but the current one; "none" none', () => {
    const { rerender } = render(<Steps steps={STEPS} navigable="all" />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    rerender(<Steps steps={STEPS} navigable="none" defaultValue="summary" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('Rating', () => {
  it('is a group of radios named by its legend; arrows move and choose; chosen stars are filled', async () => {
    const onChange = vi.fn();
    render(<Rating label="Il tuo voto" defaultValue={2} onValueChange={onChange} name="voto" />);
    const group = screen.getByRole('group', { name: 'Il tuo voto' });
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('aria-label'))).toEqual([
      '1 stella',
      '2 stelle',
      '3 stelle',
      '4 stelle',
      '5 stelle',
    ]);
    expect((radios[1] as HTMLInputElement).checked).toBe(true);
    const filled = () =>
      [...group.querySelectorAll('.slurp-rating-star')].map((s) => s.hasAttribute('data-on'));
    expect(filled()).toEqual([true, true, false, false, false]);
    await userEvent.click(radios[3] as HTMLElement);
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(filled()).toEqual([true, true, true, true, false]);
    expect((radios[0] as HTMLInputElement).name).toBe('voto');
  });

  it('read-only it is one image named with the value, filled to value / max', () => {
    render(<Rating label="Valutazione media" value={4.5} readOnly />);
    const img = screen.getByRole('img', { name: 'Valutazione media: 4.5 su 5' });
    expect(img.style.getPropertyValue('--slurp-rating-ratio')).toBe('0.9');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('disabled turns every radio off; read-only and disabled ratings have no axe violations', async () => {
    const { container } = render(
      <main>
        <Rating label="Il tuo voto" disabled defaultValue={3} />
        <Rating label="Media" value={3.7} max={5} readOnly />
      </main>,
    );
    for (const r of screen.getAllByRole('radio'))
      expect((r as HTMLInputElement).disabled).toBe(true);
    await expectNoAxeViolations(container);
  });
});

describe('Table', () => {
  const names = () =>
    screen
      .getAllByRole('row')
      .slice(1)
      .map((r) => within(r).getAllByRole('rowheader')[0]?.textContent);

  it('is a named, focusable scroll region with a caption, row headers and end-aligned numbers', () => {
    render(<Table caption="Telefoni" columns={COLUMNS} rows={ROWS} />);
    const region = screen.getByRole('region', { name: 'Telefoni' });
    expect(region.tabIndex).toBe(0);
    expect(screen.getByRole('table', { name: 'Telefoni' })).toBeTruthy();
    expect(screen.getAllByRole('rowheader')).toHaveLength(3);
    expect(screen.getByRole('cell', { name: '979 €' }).dataset.align).toBe('end');
  });

  it('sorts on the header button (ascending, then descending) and says so with aria-sort', async () => {
    const onSort = vi.fn();
    render(<Table caption="Telefoni" columns={COLUMNS} rows={ROWS} onSortChange={onSort} />);
    const price = screen.getByRole('button', { name: 'Prezzo' });
    await userEvent.click(price);
    expect(onSort).toHaveBeenLastCalledWith({ key: 'price', direction: 'ascending' });
    expect(price.closest('th')?.getAttribute('aria-sort')).toBe('ascending');
    expect(names()).toEqual(['Pixel 10', 'Galaxy S26', 'iPhone 17']);
    await userEvent.click(price);
    expect(price.closest('th')?.getAttribute('aria-sort')).toBe('descending');
    expect(names()).toEqual(['iPhone 17', 'Galaxy S26', 'Pixel 10']);
    await userEvent.click(screen.getByRole('button', { name: 'Modello' }));
    expect(price.closest('th')?.hasAttribute('aria-sort')).toBe(false);
    expect(names()).toEqual(['Galaxy S26', 'iPhone 17', 'Pixel 10']);
  });

  it('manualSort leaves the order to the app; no rows shows the empty text', () => {
    const { rerender } = render(
      <Table
        caption="Telefoni"
        columns={COLUMNS}
        rows={ROWS}
        sort={{ key: 'price', direction: 'ascending' }}
        manualSort
      />,
    );
    expect(names()).toEqual(['Pixel 10', 'iPhone 17', 'Galaxy S26']);
    rerender(<Table caption="Telefoni" columns={COLUMNS} rows={[]} />);
    expect(screen.getByRole('cell', { name: 'Nessun elemento' })).toBeTruthy();
  });

  it('hideCaption keeps the name for assistive tech only', () => {
    render(<Table caption="Telefoni" hideCaption columns={COLUMNS} rows={ROWS} />);
    expect(
      screen.getByRole('table', { name: 'Telefoni' }).querySelector('caption')?.className,
    ).toContain('slurp-visually-hidden');
  });
});

describe('Carousel', () => {
  const photos = ['Fronte', 'Retro', 'Lato', 'Dettaglio'].map((t) => <p key={t}>{t}</p>);

  it('names the carousel and its slides; only the current slide is reachable', () => {
    render(<Carousel label="Foto del prodotto">{photos}</Carousel>);
    const carousel = screen.getByRole('region', { name: 'Foto del prodotto' });
    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
    const slides = carousel.querySelectorAll('[aria-roledescription="slide"]');
    expect([...slides].map((s) => s.getAttribute('aria-label'))).toEqual([
      '1 di 4',
      '2 di 4',
      '3 di 4',
      '4 di 4',
    ]);
    expect([...slides].map((s) => s.hasAttribute('inert'))).toEqual([false, true, true, true]);
  });

  it('previous / next, the dots and the arrow keys on the track move between slides', async () => {
    const onChange = vi.fn();
    render(
      <Carousel label="Foto" onIndexChange={onChange}>
        {photos}
      </Carousel>,
    );
    const previous = screen.getByRole('button', { name: 'Precedente' });
    expect(previous).toHaveProperty('disabled', true);
    await userEvent.click(screen.getByRole('button', { name: 'Successiva' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { name: 'Mostra 2 di 4' }).getAttribute('aria-current')).toBe(
      'true',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Mostra 4 di 4' }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('button', { name: 'Successiva' })).toHaveProperty('disabled', true);
    const track = document.querySelector('.slurp-carousel-track') as HTMLElement;
    fireEvent.keyDown(track, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith(2);
    fireEvent.keyDown(track, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('above maxDots shows a counter instead of the dots; one slide has no controls', () => {
    const { rerender } = render(
      <Carousel label="Foto" maxDots={3}>
        {photos}
      </Carousel>,
    );
    expect(screen.queryByRole('group', { name: 'Scegli cosa mostrare' })).toBeNull();
    expect(document.querySelector('.slurp-carousel-status')?.textContent).toBe('1 / 4');
    rerender(
      <Carousel label="Foto">
        <p>Sola</p>
      </Carousel>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});
