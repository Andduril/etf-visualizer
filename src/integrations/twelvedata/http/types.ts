export const TWELVEDATA_FREE_EXCHANGES = new Set(['NYSE', 'NASDAQ', 'CBOE']);

export type ApiStatus = 'ok' | 'error';

export type ApiParams = Record<string, string | number | boolean | undefined>;
