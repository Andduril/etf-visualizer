import { ApiResponse } from './types';

// src/integrations/twelvedata/twelvedata.client.ts
const BASE_URL = 'https://api.twelvedata.com';

export function createTwelveDataHeaders(): HeadersInit {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('TWELVE_DATA_API_KEY is missing');
  }

  return {
    Authorization: `Bearer ${apiKey}`,
  };
}

export async function twelveDataFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...createTwelveDataHeaders(),
      ...init.headers,
    },
    cache: 'no-store',
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    return {
      status: 'error',
      code: res.status,
      message: 'HTTP error from Twelve Data',
    };
  }

  if (json.status === 'error') {
    return json;
  }

  return json;
}
