import { and, eq, type InferInsertModel } from 'drizzle-orm';
import { etfsTable } from '@/src/db/schema';
import { getDb } from '@/src/db';

export type EtfInsertRow = Omit<InferInsertModel<typeof etfsTable>, 'createdAt' | 'updatedAt'>;

export async function etfExist(symbol: string, exchange: string): Promise<boolean> {
  const { db } = await getDb();

  const result = await db
    .select({ id: etfsTable.id })
    .from(etfsTable)
    .where(and(eq(etfsTable.symbol, symbol), eq(etfsTable.exchange, exchange)));

  return result.length === 1;
}
