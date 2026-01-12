import type { InferInsertModel } from 'drizzle-orm';
import { etfsTable } from '@/src/db/schema';

export type EtfInsertRow = Omit<InferInsertModel<typeof etfsTable>, 'createdAt' | 'updatedAt'>;
