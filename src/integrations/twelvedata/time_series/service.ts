import { TimeSeries } from '@/src/features/time_series/models/TimeSeries';
import { twelvedataFetch } from '../http/client';
import { mapTimeSeries } from './mapper';
import { Interval, TimeSeriesDto, TimeSeriesDtoSchema } from './schema';
import { etfExist } from '@/src/features/etfs/repository/etfs.repository';

type TimeSeriesParam = {
  symbol: string;
  exchange: string;
  interval: Interval;
  outputsize?: number;
  startDate?: string;
  endDate?: string;
};

function cleanParams<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as {
    [K in keyof T]: Exclude<T[K], undefined | null>;
  };
}

export async function getOneTimeSeries(options: TimeSeriesParam): Promise<TimeSeries> {
  const exist = await etfExist(options.symbol, options.exchange);
  if (!exist) throw new Error(`Etf with symbol: ${options.symbol} do not exist`);

  const params = cleanParams({
    symbol: options.symbol,
    exchange: options.exchange,
    interval: options.interval,
    outputsize: options.outputsize,
    start_date: options.startDate,
    end_date: options.endDate,
  });

  const result = await twelvedataFetch<TimeSeriesDto>('/time_series', {
    params,
    schema: TimeSeriesDtoSchema,
    init: {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    },
  });

  return mapTimeSeries(result);
}
