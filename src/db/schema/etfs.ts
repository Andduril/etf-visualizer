import { char, integer, pgTable, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

export const etfsTable = pgTable(
  'etfs',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    symbol: varchar({ length: 32 }).notNull(),
    name: varchar({ length: 255 }),
    currency: char({ length: 3 }),
    exchange: varchar({ length: 128 }),
    micCode: char('mic_code', { length: 4 }),
    country: varchar({ length: 128 }),
    figiCode: char('figi_code', { length: 12 }),
    cfiCode: char('cfi_code', { length: 6 }),

    isin: varchar({ length: 32 }),
    cusip: varchar({ length: 32 }),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('etfs_symbol_exchange_currency_uq').on(t.symbol, t.currency, t.exchange)]
);
