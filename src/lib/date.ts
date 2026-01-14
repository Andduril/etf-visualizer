import type { Interval } from '@/src/integrations/twelvedata/time_series/schema';

export type Delay = '6M' | '1M' | '1W' | '1D';

const INTRADAY: ReadonlySet<Interval> = new Set([
  '1min',
  '5min',
  '15min',
  '30min',
  '45min',
  '1h',
  '2h',
  '4h',
  '8h',
]);

function isIntraday(interval: Interval): boolean {
  return INTRADAY.has(interval);
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function formatDateTimeForTwelveData(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatDateYMD(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getLastMarketDayDate(now = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay(); // 0 dim, 1 lun, 6 sam
  if (day === 1)
    d.setDate(d.getDate() - 3); // lundi -> vendredi
  else if (day === 0)
    d.setDate(d.getDate() - 2); // dimanche -> vendredi
  else if (day === 6)
    d.setDate(d.getDate() - 1); // samedi -> vendredi
  else d.setDate(d.getDate() - 1); // mar-ven -> hier

  return d;
}

/**
 * End date "market-safe" pour un interval.
 * - intraday => YYYY-MM-DD 23:59:59
 * - daily+  => YYYY-MM-DD
 */
export function buildEndDateForInterval(interval: Interval, now = new Date()) {
  const date = getLastMarketDayDate(now);

  if (isIntraday(interval)) {
    const end = new Date(date);
    end.setHours(23, 59, 59, 0);
    return { date: end, iso: formatDateTimeForTwelveData(end) };
  }

  return { date, iso: formatDateYMD(date) };
}

/**
 * Start date pour une fenêtre Delay. Ici, tu veux 1D.
 * Pour intraday: start = même market day à 00:00:00 (ou si tu veux plus strict, 09:30)
 */
export function buildStartDateForDelay(delay: Delay, interval: Interval, end: Date) {
  if (delay !== '1D') {
    throw new Error('Implémenté uniquement pour 1D ici');
  }

  // Fenêtre 1D : même jour que end, début de journée
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);

  if (isIntraday(interval)) {
    return { date: start, iso: formatDateTimeForTwelveData(start) };
  }

  return { date: start, iso: formatDateYMD(start) };
}
