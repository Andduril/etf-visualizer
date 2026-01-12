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

export type DedupeStrategy = 'first' | 'last';

export type DedupeOptions<T> = {
  /** Construit la clé de déduplication (doit être stable/déterministe). */
  keyOf: (row: T) => string;

  /** Normalise une row avant insertion dans la map (ex: trim, upper, coercions). */
  normalize?: (row: T) => T;

  /**
   * Si défini, permet de fusionner deux rows avec la même clé.
   * - current: la row déjà retenue
   * - incoming: la nouvelle row
   * Retourne la row finale.
   */
  merge?: (current: T, incoming: T) => T;

  /** Choix quand il y a collision et pas de merge: 'last' (défaut) ou 'first'. */
  strategy?: DedupeStrategy;
};

/**
 * Déduplique un tableau selon une clé.
 * Par défaut: la dernière occurrence gagne.
 */
export function dedupeByKey<T>(rows: readonly T[], opts: DedupeOptions<T>): T[] {
  const { keyOf, normalize, merge, strategy = 'last' } = opts;

  const map = new Map<string, T>();

  for (const raw of rows) {
    const row = normalize ? normalize(raw) : raw;
    const key = keyOf(row);

    if (!map.has(key)) {
      map.set(key, row);
      continue;
    }

    if (merge) {
      const current = map.get(key)!;
      map.set(key, merge(current, row));
      continue;
    }

    if (strategy === 'last') {
      map.set(key, row);
    }
    // strategy === 'first' => ne rien faire
  }

  return Array.from(map.values());
}

export type BulkInsertParams<TTable extends PgTable> = {
  table: TTable;
  rows: Array<PgInsertValue<TTable>>;
  dedupeOptions?: DedupeOptions<PgInsertValue<TTable>>;
} & (
  | { onConflictDoNothing: OnConflictDoNothingConfig<TTable>; onConflictDoUpdate?: never }
  | { onConflictDoUpdate: OnConflictDoUpdateConfig<TTable>; onConflictDoNothing?: never }
  | { onConflictDoUpdate?: never; onConflictDoNothing?: never }
);

export async function bulkInsert<TTable extends PgTable>({
  table,
  rows,
  dedupeOptions,
  ...params
}: BulkInsertParams<TTable>) {
  const BATCH_SIZE = 2000;
  const { db } = await getDb();

  for (const batch of chunk(rows, BATCH_SIZE)) {
    const dedupedBatch = dedupeOptions ? dedupeByKey(batch, dedupeOptions) : batch;

    try {
      if (params.onConflictDoUpdate) {
        await db.insert(table).values(dedupedBatch).onConflictDoUpdate(params.onConflictDoUpdate);
      } else if (params.onConflictDoNothing) {
        await db.insert(table).values(dedupedBatch).onConflictDoNothing(params.onConflictDoNothing);
      } else {
        await db.insert(table).values(dedupedBatch);
      }
    } catch (err) {
      console.error('[bulkInsert] sample batch rows:', JSON.stringify(batch.slice(0, 5)));
      throw err;
    }
  }
}
