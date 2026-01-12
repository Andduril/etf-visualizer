import { PgInsert, PgInsertValue, PgTable } from 'drizzle-orm/pg-core';
import { getDb } from '.';

type OnConflictDoNothingConfig<TTable extends PgTable> = Parameters<
  PgInsert<TTable>['onConflictDoNothing']
>[0];
type OnConflictDoUpdateConfig<TTable extends PgTable> = Parameters<
  PgInsert<TTable>['onConflictDoUpdate']
>[0];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export type BulkInsertParams<TTable extends PgTable> = {
  table: TTable;
  rows: Array<PgInsertValue<TTable>>;
} & (
  | { onConflictDoNothing: OnConflictDoNothingConfig<TTable>; onConflictDoUpdate?: never }
  | { onConflictDoUpdate: OnConflictDoUpdateConfig<TTable>; onConflictDoNothing?: never }
  | { onConflictDoUpdate?: never; onConflictDoNothing?: never }
);

export async function bulkInsert<TTable extends PgTable>({
  table,
  rows,
  ...params
}: BulkInsertParams<TTable>) {
  const BATCH_SIZE = 2000;
  const { db } = await getDb();

  for (const batch of chunk(rows, BATCH_SIZE)) {
    try {
      if (params.onConflictDoUpdate) {
        await db.insert(table).values(batch).onConflictDoUpdate(params.onConflictDoUpdate);
      } else if (params.onConflictDoNothing) {
        await db.insert(table).values(batch).onConflictDoNothing(params.onConflictDoNothing);
      } else {
        await db.insert(table).values(batch);
      }
    } catch (err) {
      console.error('[bulkInsert] sample batch rows:', JSON.stringify(batch.slice(0, 5)));
      throw err;
    }
  }
}
