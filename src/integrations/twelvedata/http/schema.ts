import z from 'zod';

export const ApiStatusSchema = z.enum(['ok', 'error']);
