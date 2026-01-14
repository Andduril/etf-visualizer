import z from 'zod';
import { ApiParams, TWELVEDATA_FREE_EXCHANGES } from './types';

// src/integrations/twelvedata/twelvedata.client.ts
const BASE_URL = 'https://api.twelvedata.com';
const apiKey = process.env.API_KEY!;

type FetchOptions<T> = {
  schema: z.ZodType<T>;
  params: ApiParams;
  init?: RequestInit;
};

export function isSupportedByFreePlan(exchange?: string | null): boolean {
  if (!exchange) return false;
  return TWELVEDATA_FREE_EXCHANGES.has(exchange.toUpperCase());
}

export async function twelvedataFetch<T>(path: string, options: FetchOptions<T>): Promise<T> {
  const { params, schema, init } = options;
  const searchParams = new URLSearchParams();

  // Auth
  searchParams.append('apikey', apiKey);

  // Parameters injection
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
  }

  // Url
  const url = `${BASE_URL}${path}?${searchParams.toString()}`;

  // Fetch data
  const res = await fetch(url, { ...init });

  // Handle error
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json: unknown = await res.json();

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid API response: ${parsed.error.message}`);
  }

  return parsed.data;
}

// export async function twelveDataFetch<T extends object>(
//   path: string,
//   params?: Record<string, string | number | boolean | undefined>,
//   cache: RequestCache = 'default',
//   init: RequestInit = {}
// ): Promise<ApiResponse<T>> {
//   const searchParams = new URLSearchParams();

//   // Auth
//   searchParams.append('apikey', apiKey);

//   if (params) {
//     for (const [key, value] of Object.entries(params)) {
//       if (value !== undefined) {
//         searchParams.append(key, String(value));
//       }
//     }
//   }

//   const url =
//     searchParams.toString().length > 0
//       ? `${BASE_URL}${path}?${searchParams.toString()}`
//       : `${BASE_URL}${path}`;

//   const res = await fetch(url, {
//     ...init,
//     headers: {
//       ...init.headers,
//     },
//     cache: cache,
//   });

//   const json = (await res.json()) as ApiResponse<T>;

//   if (!res.ok) {
//     return {
//       status: 'error',
//       code: res.status,
//       message: 'HTTP error from Twelve Data',
//     };
//   }

//   if (json.status === 'error') {
//     return json;
//   }

//   return json;
// }
