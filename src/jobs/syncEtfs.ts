import { bulkInsert } from '../db/utils';
import { etfSchema, validEtf } from '../features/etfs/model/etfs.zod';
import { getAllEtfs } from '../integrations/twelvedata/etf/service';
import { etfsTable } from '../db/schema/etfs';
import { toEtfInsertRow } from '../features/etfs/repository/etfs.parser';
import { sql } from 'drizzle-orm';

export async function syncEtfs() {
  // Get dtos
  const dtos = await getAllEtfs().catch((err) => {
    const errorMessage = `[syncEtfs] error while fetching data : ${err}`;
    console.error(errorMessage);
    throw Error(errorMessage);
  });

  const validEtfs: (typeof etfsTable.$inferInsert)[] = [];
  const errors: string[] = [];

  for (const dto of dtos) {
    const parsed = etfSchema.safeParse(dto);

    if (!parsed.success) {
      errors.push(parsed.error.message);
      continue;
    }

    validEtfs.push(toEtfInsertRow(parsed.data));
  }

  if (errors.length > 0) {
    const errorMessage = `[syncEtfs] ${errors.length} ETFs skipped due to validation errors`;
    console.warn(
      errorMessage,
      errors.slice(0, 5) // prevent spams
    );
    throw Error(errorMessage);
  }

  // Database
  await bulkInsert({
    table: etfsTable,
    rows: validEtfs,
    dedupeOptions: {
      keyOf: (r) => `${r.symbol}||${r.exchange ?? ''}||${r.currency ?? ''}`,
    },
    onConflictDoUpdate: {
      target: [etfsTable.symbol, etfsTable.exchange, etfsTable.currency],
      set: {
        name: sql.raw(`excluded."name"`),
        micCode: sql.raw(`excluded."mic_code"`),
        country: sql.raw(`excluded."country"`),
        figiCode: sql.raw(`excluded."figi_code"`),
        cfiCode: sql.raw(`excluded."cfi_code"`),
        isin: sql.raw(`excluded."isin"`),
        cusip: sql.raw(`excluded."cusip"`),

        updatedAt: sql`now()`,
      },
    },
  });
}
