import { z } from 'zod';

export const emptyStringToNull = z.preprocess((v) => {
  if (v === undefined || v === null) return null;
  if (typeof v !== 'string') return v;
  const trimmed = v.trim();
  return trimmed === '' ? null : trimmed;
}, z.string().nullable());
