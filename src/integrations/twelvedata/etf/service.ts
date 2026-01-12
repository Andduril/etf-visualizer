import { twelveDataFetch } from '../client';
import { TwelvedataEtfDto } from './dto';

export async function getAllEtfs(): Promise<TwelvedataEtfDto[]> {
  const result = await twelveDataFetch<TwelvedataEtfDto[]>('/etf');

  if (result.status == 'error') {
    throw new Error(result.message ?? 'TwelveData error');
  }

  if (result.data.length === 0) {
    throw new Error('Error data is empty');
  }

  return result.data;
}
