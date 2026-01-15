import { etfExist } from '@/src/features/etfs/repository/etfs.repository';
import { QuoteDto, QuoteDtoSchema } from './schema';
import { twelvedataFetch } from '../http/client';

export async function getOneQuote(symbol: string, exchange: string): Promise<QuoteDto> {
  const exist = await etfExist(symbol, exchange);
  if (!exist) throw new Error(`Etf with symbol: ${symbol} and exhange: ${exchange} do not exist`);

  const params = {
    symbol,
    exchange,
  };

  const result = await twelvedataFetch<QuoteDto>('/quote', {
    params,
    schema: QuoteDtoSchema,
    init: {
      next: { revalidate: 60 },
    },
  });

  return result;
}
