import { TimeSeries } from '@/src/features/time_series/models/TimeSeries';
import { TimeSeriesValue } from '@/src/features/time_series/models/TimeSeriesValue';
import { TimeSeriesDto, TimeSeriesValueDto } from './schema';

export function mapTimeSeriesValue(dto: TimeSeriesValueDto): TimeSeriesValue {
  const datetime = new Date(dto.datetime);

  if (Number.isNaN(datetime.getTime())) {
    throw new Error(`Invalid datetime format: ${dto.datetime}`);
  }

  return {
    datetime,
    open: Number.parseFloat(dto.open),
    high: Number.parseFloat(dto.high),
    low: Number.parseFloat(dto.low),
    close: Number.parseFloat(dto.close),
    volume: Number.parseInt(dto.volume, 10),
  };
}

export function mapTimeSeries(dto: TimeSeriesDto): TimeSeries {
  return {
    symbol: dto.meta.symbol,
    values: dto.values.map(mapTimeSeriesValue),
  };
}
