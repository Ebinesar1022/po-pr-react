/**
 * Date range filtering for the "Purchase Order & Receive Performance
 * Report" dashboard. Dates coming back from Zoho Creator are formatted
 * as dd-MMM-yyyy (e.g. "27-Aug-2025") per the app's date format config,
 * so we parse that explicitly instead of relying on the browser's
 * (inconsistent) Date.parse behaviour for non-ISO strings.
 */

export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

const MONTH_NAMES: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseAppDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;

  // Zoho Creator default: dd-MMM-yyyy (e.g. "27-Aug-2025")
  const match = str.match(/^(\d{1,2})-([A-Za-z]{3,})-(\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = MONTH_NAMES[match[2].slice(0, 3).toLowerCase()];
    const year = Number(match[3]);
    if (month !== undefined && Number.isFinite(day) && Number.isFinite(year)) {
      const parsed = new Date(year, month, day);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  // Fallback for any other (e.g. ISO) format.
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

/** Returns true when `date` falls inside `range`, inclusive. An unset
 * range (start or end missing) means "All Time" — everything passes. */
export function isWithinRange(date: Date | null, range: DateRangeValue): boolean {
  if (!range.start || !range.end) return true;
  if (!date) return false;
  const t = date.getTime();
  return t >= range.start.getTime() && t <= range.end.getTime();
}

export function formatRangeLabel(range: DateRangeValue): string {
  if (!range.start || !range.end) return 'All Time';
  const { start, end } = range;
  const startStr = `${MONTH_ABBR[start.getMonth()]} ${start.getDate()}`;
  const endStr = `${MONTH_ABBR[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  if (start.getFullYear() === end.getFullYear()) {
    return `${startStr} – ${endStr}`;
  }
  return `${startStr}, ${start.getFullYear()} – ${endStr}`;
}

export type PresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'thisYear'
  | 'lastYear'
  | 'allTime';

export interface Preset {
  key: PresetKey;
  label: string;
}

export const PRESETS: Preset[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'last30', label: 'Last 30 Days' },
  { key: 'thisMonth', label: 'This Month' },
  { key: 'lastMonth', label: 'Last Month' },
  { key: 'thisQuarter', label: 'This Quarter' },
  { key: 'thisYear', label: 'This Year' },
  { key: 'lastYear', label: 'Last Year' },
  { key: 'allTime', label: 'All Time' }
];

export function resolvePreset(key: PresetKey): DateRangeValue {
  const now = new Date();

  switch (key) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday': {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return { start: startOfDay(d), end: endOfDay(d) };
    }
    case 'last7': {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      return { start: startOfDay(start), end: endOfDay(now) };
    }
    case 'last30': {
      const start = new Date(now);
      start.setDate(start.getDate() - 29);
      return { start: startOfDay(start), end: endOfDay(now) };
    }
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case 'thisQuarter': {
      const quarter = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), quarter * 3, 1);
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case 'thisYear': {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case 'lastYear': {
      const start = new Date(now.getFullYear() - 1, 0, 1);
      const end = new Date(now.getFullYear() - 1, 11, 31);
      return { start: startOfDay(start), end: endOfDay(end) };
    }
    case 'allTime':
    default:
      return { start: null, end: null };
  }
}
