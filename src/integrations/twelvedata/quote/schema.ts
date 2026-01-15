import { z } from 'zod';

export const QuoteDtoSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  mic_code: z.string(),
  currency: z.string(),

  datetime: z.string(), // ou z.coerce.date() si tu veux un Date
  timestamp: z.number(),
  last_quote_at: z.number(),

  open: z.coerce.number(),
  high: z.coerce.number(),
  low: z.coerce.number(),
  close: z.coerce.number(),
  volume: z.coerce.number(),

  previous_close: z.coerce.number(),
  change: z.coerce.number(),
  percent_change: z.coerce.number(),
  average_volume: z.coerce.number(),

  is_market_open: z.boolean(),

  fifty_two_week: z.object({
    low: z.coerce.number(),
    high: z.coerce.number(),
    low_change: z.coerce.number(),
    high_change: z.coerce.number(),
    low_change_percent: z.coerce.number(),
    high_change_percent: z.coerce.number(),
    range: z.string(),
  }),
});

export type QuoteDto = z.infer<typeof QuoteDtoSchema>;
