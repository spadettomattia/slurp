import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import * as icons from '../src';

const all = Object.entries(icons).filter(([name]) => /^[A-Z]\w*Icon$/.test(name));

describe('icons', () => {
  it.each(all)('%s is a 24×24 stroke SVG, decorative by default', (_name, Icon) => {
    const Component = Icon as typeof icons.CheckIcon;
    const { container } = render(<Component />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
    expect(svg?.getAttribute('stroke-width')).toBe('2');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.children.length).toBeGreaterThan(0);
  });

  it('gets a role and a name with title, and passes size and props through', () => {
    const { container } = render(<icons.SearchIcon title="Cerca" size={16} className="x" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Cerca');
    expect(svg?.hasAttribute('aria-hidden')).toBe(false);
    expect(svg?.getAttribute('width')).toBe('16');
    expect(svg?.classList.contains('x')).toBe(true);
  });
});
