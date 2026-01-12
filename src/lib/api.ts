export function mapError(err: unknown) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  return { status: 500, body: { code: 'INTERNAL_ERROR', message } };
}
