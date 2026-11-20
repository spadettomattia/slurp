import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Calendar,
  createTheme,
  DateField,
  ErrorSummary,
  FileDrop,
  Footer,
  Kbd,
  Media,
  NumberField,
  PinField,
  Quote,
  SecretField,
  SlurpProvider,
  Tag,
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
