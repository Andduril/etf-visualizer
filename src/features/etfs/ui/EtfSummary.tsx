import { ComponentProps } from 'react';
import { validEtf } from '../model/etfs.zod';
import { cn, getCurrencySymbol } from '@/src/lib/utils';
import { getOneQuote } from '@/src/integrations/twelvedata/quote/service';
import { Badge } from '@/src/components/ui/badge';
import { QuoteDto } from '@/src/integrations/twelvedata/quote/schema';

type EtfSummaryProps = ComponentProps<'div'> & {
  etf: QuoteDto;
};

const EtfSummary = async ({ etf, className, ...props }: EtfSummaryProps) => {
  return (
    <div className={cn('flex flex-col justify-center items-start p-4 gap-4', className)} {...props}>
      <h2 className="text-2xl">🇺🇸 {etf.name}</h2>

      <div className="flex items-start gap-1">
        <h3 className="text-5xl">
          {etf.close.toFixed(2)} {getCurrencySymbol(etf.currency)}
        </h3>
        <Badge
          className={
            etf.percent_change > 0 ? 'bg-green-400 text-green-950' : 'bg-red-400 text-red-950'
          }
        >
          {etf.percent_change.toFixed(2)}% (24h)
        </Badge>
      </div>
    </div>
  );
};

export default EtfSummary;
