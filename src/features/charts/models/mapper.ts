import type { CandlestickData, Time } from 'lightweight-charts';
import { TimeSeries } from '../../time_series/models/TimeSeries';

export function toCandleData(ts: TimeSeries): CandlestickData<Time>[] {
  return ts.values
    .slice()
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .map((v) => ({
      time: Math.floor(v.datetime.getTime() / 1000) as Time,
      open: v.open,
      high: v.high,
      low: v.low,
      close: v.close,
    }));
}
