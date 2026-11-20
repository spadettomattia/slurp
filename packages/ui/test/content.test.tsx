import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Code, Contents, Hairline, PageNav, Prose, Rail, SkipLink, SlurpProvider } from '../src';
import { expectNoAxeViolations } from './axe';

describe('Hairline', () => {
  it('is decorative by default and a separator when it means something', () => {
    const { container } = render(
      <>
        <Hairline />
        <Hairline decorative={false} orientation="vertical" />
      </>,
    );
    const [plain, meaningful] = [...container.querySelectorAll('hr')];
    expect(plain?.getAttribute('aria-hidden')).toBe('true');
    expect(meaningful?.hasAttribute('aria-hidden')).toBe(false);
    expect(meaningful?.getAttribute('aria-orientation')).toBe('vertical');
    expect(screen.getAllByRole('separator', { hidden: false })).toHaveLength(1);
  });
});

describe('SkipLink', () => {
  it('jumps to #content and speaks the provider language', () => {
    const { rerender } = render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Vai al contenuto' }).getAttribute('href')).toBe(
      '#content',
    );
    rerender(
      <SlurpProvider storageKey={null} labels="en">
        <SkipLink href="#main" />
      </SlurpProvider>,
    );
    expect(screen.getByRole('link', { name: 'Skip to content' }).getAttribute('href')).toBe(
      '#main',
    );
  });
});

describe('Prose', () => {
  it('styles plain HTML and has no axe violations', async () => {
    const { container } = render(
      <main>
        <Prose as="article">
          <h1>Titolo</h1>
          <p>
            Un paragrafo con un <a href="#x">link</a> e del <code>codice</code>.
          </p>
          <ul>
            <li>Primo</li>
            <li>Secondo</li>
          </ul>
          <blockquote>
            <p>Una citazione.</p>
          </blockquote>
        </Prose>
      </main>,
    );
    expect(container.querySelector('article.slurp-prose')).not.toBeNull();
    await expectNoAxeViolations(container);
  });
});

describe('Code', () => {
  it('copies its text, says so, and names its scrollable region after the file', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Code filename="main.tsx" code="const a = 1;" />);
    expect(screen.getByRole('region', { name: 'main.tsx' }).textContent).toBe('const a = 1;');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copia il codice' }));
    });
    expect(writeText).toHaveBeenCalledWith('const a = 1;');
    expect(screen.getByRole('button', { name: 'Copiato' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Copiato');
  });

  it('shows highlighted html but copies its text', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { container } = render(
      <main>
        <Code language="tsx" html='<span style="color:var(--shiki-token-keyword)">let</span> b' />
      </main>,
    );
    expect(screen.getByRole('region', { name: 'tsx' }).querySelector('span')).not.toBeNull();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copia il codice' }));
    });
    expect(writeText).toHaveBeenCalledWith('let b');
    await expectNoAxeViolations(container);
  });
});

describe('Contents', () => {
  const items = [
    { id: 'uno', label: 'Uno' },
    { id: 'due', label: 'Due', level: 3 as const },
  ];

  it('links to the sections and marks the one being read', async () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <main>
        <Contents items={items} active="due" onNavigate={onNavigate} />
      </main>,
    );
    const nav = screen.getByRole('navigation', { name: 'In questa pagina' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#uno', '#due']);
    expect(links[1]?.getAttribute('aria-current')).toBe('location');
    expect(links[0]?.hasAttribute('aria-current')).toBe(false);
    fireEvent.click(links[0] as HTMLElement);
    expect(onNavigate).toHaveBeenCalledWith('uno');
    await expectNoAxeViolations(container);
  });

  it('renders nothing for fewer than two sections', () => {
    const { container } = render(<Contents items={[items[0] as (typeof items)[0]]} />);
    expect(container.querySelector('nav')).toBeNull();
  });
});

describe('Rail', () => {
  it('is a named navigation of grouped links, the current page marked', async () => {
    const { container } = render(
      <main>
        <Rail label="Documentazione">
          <Rail.Group title="Azioni">
            <Rail.Link href="#button" current>
              Button
            </Rail.Link>
            <Rail.Link href="#chip">Chip</Rail.Link>
          </Rail.Group>
        </Rail>
      </main>,
    );
    const nav = screen.getByRole('navigation', { name: 'Documentazione' });
    expect(within(nav).getByRole('list', { name: 'Azioni' })).toBeTruthy();
    expect(within(nav).getByRole('link', { name: 'Button' }).getAttribute('aria-current')).toBe(
      'page',
    );
    await expectNoAxeViolations(container);
  });
});

describe('PageNav', () => {
  it('links the previous and next pages, with any link component', async () => {
    function RouterLink({ to, ...rest }: { to: string }) {
      // Like React Router's Link: the href it computes wins over the one Button forwards.
      return <a {...rest} href={`/app${to}`} />;
    }
    const { container } = render(
      <main>
        <PageNav
          linkAs={RouterLink}
          previous={{ title: 'Installazione', to: '/installazione' }}
          next={{ title: 'Tema', to: '/tema' }}
        />
      </main>,
    );
    const nav = screen.getByRole('navigation', { name: 'Pagina precedente e successiva' });
    const [prev, next] = within(nav).getAllByRole('link');
    expect(prev?.getAttribute('href')).toBe('/app/installazione');
    expect(prev?.textContent).toBe('PrecedenteInstallazione');
    expect(next?.textContent).toBe('SuccessivaTema');
    await expectNoAxeViolations(container);
  });

  it('renders nothing without neighbours', () => {
    const { container } = render(<PageNav />);
    expect(container.querySelector('nav')).toBeNull();
  });
});
