import { z } from 'zod';
import { ApiStatusSchema } from '../http/schema';

export const IntervalSchema = z.enum([
  '1min',
  '5min',
  '15min',
  '30min',
  '45min',
  '1h',
  '2h',
  '4h',
  '8h',
  '1day',
  '1week',
  '1month',
]);

export const MetaDtoSchema = z.object({
  symbol: z.string(),
  interval: IntervalSchema,
  currency: z.string(),
  exchange_timezone: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  type: z.string(),
});

export const TimeSeriesValueDtoSchema = z.object({
  datetime: z.string(),
  open: z.string(),
  high: z.string(),
  low: z.string(),
  close: z.string(),
  volume: z.string(),
});

export const TimeSeriesDtoSchema = z.object({
  meta: MetaDtoSchema,
  values: z.array(TimeSeriesValueDtoSchema),
  status: ApiStatusSchema,
});

export type Interval = z.infer<typeof IntervalSchema>;
export type MetaDto = z.infer<typeof MetaDtoSchema>;
export type TimeSeriesValueDto = z.infer<typeof TimeSeriesValueDtoSchema>;
export type TimeSeriesDto = z.infer<typeof TimeSeriesDtoSchema>;
