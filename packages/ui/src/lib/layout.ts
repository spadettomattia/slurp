// Server-safe layout math of the design system (bentoLayout) and its search helpers (matchesAll, matchRanges).

export interface BentoItem {
  id: string;
  /** Any size measure (how many entries a section has). Default 1. */
  weight?: number;
}

export interface BentoSpan {
  id: string;
  colSpan: number;
  rowSpan: number;
  size: 'large' | 'small';
}

/** Splits `total` columns by weight, at least `min` each; leftovers go to the largest remainders. */
function split(total: number, weights: number[], min: number): number[] {
  const n = weights.length;
  if (!n) return [];
  const free = total - min * n;
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (free * w) / sum);
  const out = raw.map((r) => min + Math.floor(r));
  const left = total - out.reduce((a, b) => a + b, 0);
  raw
    .map((r, i) => [r - Math.floor(r), i] as const)
    .sort((a, b) => b[0] - a[0])
    .slice(0, left)
    .forEach(([, i]) => (out[i] = (out[i] ?? min) + 1));
  return out;
}

/**
 * Spans of the entry grid (12 columns), items in priority order. score = weight × (1 + 0.35 × (n − 1 − rank)).
 * #1 tall on the left (4–6 columns, 2 rows) · #2 beside it · #3–#4 below #2 · the rest in rows of up to 3.
 */
export function bentoLayout(items: BentoItem[], columns = 12): BentoSpan[] {
  const n = items.length;
  const w = items.map((it, i) => Math.max(1, it.weight ?? 1) * (1 + 0.35 * (n - 1 - i)));
  const res: BentoSpan[] = items.map((it) => ({
    id: it.id,
    colSpan: columns,
    rowSpan: 1,
    size: 'small',
  }));
  const [a, b] = res;
  if (!a) return res;
  if (!b) {
    a.rowSpan = 2;
    a.size = 'large';
    return res;
  }
  const w0 = w[0] ?? 1;
  const w1 = w[1] ?? 1;
  const first = Math.min(columns - 6, Math.max(4, Math.round((columns * w0) / (w0 + w1))));
  const right = columns - first;
  Object.assign(a, { colSpan: first, rowSpan: 2, size: 'large' });
  Object.assign(b, { colSpan: right, size: 'large' });
  if (n === 3 && res[2]) res[2].colSpan = right;
  if (n >= 4) {
    split(right, [w[2] ?? 1, w[3] ?? 1], 3).forEach((s, i) => {
      const item = res[i + 2];
      if (item) item.colSpan = s;
    });
  }
  for (let start = 4; start < n; start += 3) {
    split(columns, w.slice(start, start + 3), 3).forEach((s, i) => {
      const item = res[start + i];
      if (item) Object.assign(item, { colSpan: s, size: s >= 6 ? 'large' : 'small' });
    });
  }
  return res;
}

/** Case- and accent-insensitive form ("Più" → "piu"). */
export function normalizeText(s: string): string {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const terms = (q: string) => normalizeText(q).split(/\s+/).filter(Boolean);

/** List search: true when every word of the query appears in the text, in any order. */
export function matchesAll(text: string, query: string): boolean {
  const t = normalizeText(text);
  return terms(query).every((w) => t.includes(w));
}

/** In-page search: [start, end) ranges of the original text where the phrase appears. */
export function matchRanges(text: string, query: string): [number, number][] {
  const needle = terms(query).join(' ');
  const out: [number, number][] = [];
  if (!needle) return out;
  let flat = '';
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    for (const ch of normalizeText(text[i] ?? '')) {
      flat += ch;
      map.push(i);
    }
  }
  for (let at = flat.indexOf(needle); at !== -1; at = flat.indexOf(needle, at + needle.length)) {
    out.push([map[at] ?? 0, (map[at + needle.length - 1] ?? 0) + 1]);
  }
  return out;
}
