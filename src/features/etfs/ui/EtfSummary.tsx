import { ComponentProps } from 'react';
import { validEtf } from '../model/etfs.zod';
import { cn } from '@/src/lib/utils';

type EtfSummaryProps = ComponentProps<'div'> & {
  etf: validEtf;
};

const EtfSummary = async ({ etf, className, ...props }: EtfSummaryProps) => {
  return (
    <div
      className={cn('flex flex-col justify-center items-start border p-4 rounded-2xl', className)}
      {...props}
    >
      <h2 className="text-2xl">🇺🇸 {etf.name}</h2>
    </div>
  );
};

export default EtfSummary;
