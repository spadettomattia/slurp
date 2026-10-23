import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  COMPACT_QUERY,
  focusFirst,
  moveFocus,
  useControlled,
  useDismiss,
  useMediaQuery,
} from '../src';

afterEach(() => vi.unstubAllGlobals());

function list(html: string) {
  document.body.innerHTML = `<div id="root">${html}</div>`;
  return document.getElementById('root') as HTMLElement;
}

const key = (k: string) => new KeyboardEvent('keydown', { key: k, cancelable: true });

describe('moveFocus', () => {
  it('moves with the arrows, skips disabled items, stops at the ends unless looping', () => {
    const root = list('<button>a</button><button disabled>b</button><button>c</button>');
    const [a, , c] = root.querySelectorAll('button');
    a?.focus();
    expect(moveFocus(key('ArrowDown'), root, 'button')).toBe(c);
    expect(moveFocus(key('ArrowDown'), root, 'button')).toBe(c);
    expect(moveFocus(key('ArrowDown'), root, 'button', { loop: true })).toBe(a);
    expect(moveFocus(key('End'), root, 'button')).toBe(c);
    expect(moveFocus(key('x'), root, 'button')).toBeNull();
  });

  it('calls onExitStart from the first item (the field above a result list)', () => {
    const root = list('<button>a</button><button>b</button>');
    root.querySelector('button')?.focus();
    const exit = vi.fn();
    expect(moveFocus(key('ArrowUp'), root, 'button', exit)).toBeNull();
    expect(exit).toHaveBeenCalled();
  });

  it('honours orientation', () => {
    const root = list('<button>a</button><button>b</button>');
    root.querySelector('button')?.focus();
    expect(moveFocus(key('ArrowDown'), root, 'button', { orientation: 'horizontal' })).toBeNull();
    expect(
      moveFocus(key('ArrowRight'), root, 'button', { orientation: 'horizontal' })?.textContent,
    ).toBe('b');
  });
});

describe('focusFirst', () => {
  it('prefers the active choice, else the first control', () => {
    let root = list('<button>a</button><button aria-pressed="true">b</button>');
    expect(focusFirst(root)?.textContent).toBe('b');
    root = list('<span></span><a href="#x">link</a>');
    expect(focusFirst(root)?.textContent).toBe('link');
    expect(focusFirst(null)).toBeNull();
  });
});

describe('useControlled', () => {
  it('keeps its own state when uncontrolled and follows value when controlled', () => {
    const onChange = vi.fn();
    const own = renderHook(() => useControlled({ value: undefined, defaultValue: 1, onChange }));
    act(() => own.result.current[1](2));
    expect(own.result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);

    const held = renderHook(({ v }) => useControlled({ value: v, defaultValue: 0 }), {
      initialProps: { v: 5 },
    });
    act(() => held.result.current[1](9));
    expect(held.result.current[0]).toBe(5);
    held.rerender({ v: 7 });
    expect(held.result.current[0]).toBe(7);
  });
});

describe('useMediaQuery', () => {
  it('reads and follows matchMedia', () => {
    let matches = true;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', (q: string) => ({
      get matches() {
        return q === COMPACT_QUERY && matches;
      },
      addEventListener: (_: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    }));
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY));
    expect(result.current).toBe(true);
    matches = false;
    act(() => listeners.forEach((fn) => fn()));
    expect(result.current).toBe(false);
  });
});

describe('useDismiss', () => {
  function Panel({ onDismiss }: { onDismiss: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const { containerProps, opened } = useDismiss({ ref, open: true, onDismiss });
    return (
      <>
        <button type="button" onClick={(e) => opened(e.currentTarget)}>
          apri
        </button>
        <div ref={ref} {...containerProps}>
          <button type="button">dentro</button>
        </div>
        <button type="button">fuori</button>
      </>
    );
  }

  it('Escape closes and gives focus back to the opener; a press outside closes', () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    const opener = screen.getByRole('button', { name: 'apri' });
    fireEvent.click(opener);
    const inside = screen.getByRole('button', { name: 'dentro' });
    inside.focus();
    fireEvent.keyDown(inside, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(opener);
    fireEvent.pointerDown(inside);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'fuori' }));
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
