import 'dotenv/config';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

type DbResult =
  | { type: 'vercel'; db: VercelPgDatabase<typeof schema> }
  | { type: 'postgres'; db: NodePgDatabase<typeof schema> };

let cached: DbResult | undefined;

export async function getDb(): Promise<DbResult> {
  if (cached) return cached;

  if (process.env.DB_DRIVER === 'vercel') {
    const { drizzle } = await import('drizzle-orm/vercel-postgres');
    cached = { type: 'vercel', db: drizzle({ schema }) };
    return cached;
  }

  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('POSTGRES_URL is required when DB_DRIVER is not "vercel".');
  }

  const { drizzle } = await import('drizzle-orm/node-postgres');
  cached = { type: 'postgres', db: drizzle(url) };
  return cached;
}
