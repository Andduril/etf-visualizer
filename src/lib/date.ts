import { BusinessDay } from 'lightweight-charts';

export function toBusinessDay(isoDate: string): BusinessDay {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  return { year: y, month: m, day: d };
}
