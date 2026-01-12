import 'dotenv/config';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

type DbResult =
  | { type: 'vercel'; db: VercelPgDatabase<typeof schema> }
  | { type: 'postgres'; db: PostgresJsDatabase<typeof schema> };

let cached: DbResult | undefined;

export async function getDb(): Promise<DbResult> {
  if (cached) return cached;

  if (process.env.DB_DRIVER === 'vercel') {
    const { drizzle } = await import('drizzle-orm/vercel-postgres');
    cached = { type: 'vercel', db: drizzle({ casing: 'snake_case' }) };
    return cached;
  }

  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('POSTGRES_URL is required when DB_DRIVER is not "vercel".');
  }

  const { drizzle } = await import('drizzle-orm/postgres-js');
  cached = { type: 'postgres', db: drizzle(url, { casing: 'snake_case' }) };
  return cached;
}
