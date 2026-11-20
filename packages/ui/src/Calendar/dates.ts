// Calendar dates as ISO day strings ('2026-12-08'): serialisable and free of time zones. Local-time arithmetic only.

export type IsoDay = string;

export const toDate = (iso: IsoDay): Date => {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const pad = (n: number) => String(n).padStart(2, '0');
export const toIso = (d: Date): IsoDay =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (iso: IsoDay, n: number): IsoDay => {
  const d = toDate(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
};

/** Same day of another month, clamped to its length (31 Jan + 1 month → 28/29 Feb). */
export const addMonths = (iso: IsoDay, n: number): IsoDay => {
  const d = toDate(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toIso(d);
};

export const monthOf = (iso: IsoDay): IsoDay => `${iso.slice(0, 7)}-01`;
export const today = (): IsoDay => toIso(new Date());

/** The weeks shown for a month: whole weeks from `weekStart` (0 Sunday … 6 Saturday). */
export function monthGrid(month: IsoDay, weekStart: number): IsoDay[][] {
  const first = toDate(monthOf(month));
  const offset = (first.getDay() - weekStart + 7) % 7;
  let day = addDays(toIso(first), -offset);
  const end = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const weeks: IsoDay[][] = [];
  while (weeks.length < 6) {
    const week: IsoDay[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
    if (toDate(day) > end) break;
  }
  return weeks;
}
