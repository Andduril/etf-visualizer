import { emptyStringToNull } from '@/src/lib/zod';
import z from 'zod';

export const etfSchema = z.object({
  symbol: z.string().min(1).max(32),
  name: emptyStringToNull.pipe(z.string().max(255).nullable()),
  currency: emptyStringToNull.pipe(z.string().length(3).nullable()),
  exchange: emptyStringToNull.pipe(z.string().max(128).nullable()),
  micCode: emptyStringToNull.pipe(z.string().length(4).nullable()),
  country: emptyStringToNull.pipe(z.string().max(128).nullable()),
  figiCode: emptyStringToNull.pipe(z.string().length(12).nullable()),
  cfiCode: emptyStringToNull.pipe(z.string().length(6).nullable()),
  isin: emptyStringToNull.pipe(z.string().max(32).nullable()),
  cusip: emptyStringToNull.pipe(z.string().max(32).nullable()),
});

export type validEtf = z.infer<typeof etfSchema>;
