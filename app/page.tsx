import { toCandleData } from '@/src/features/charts/models/mapper';
import ChartContainer from '@/src/features/charts/ui/ChartContainer';
import EtfDetails from '@/src/features/etfs/ui/EtfDetails';
import EtfSummary from '@/src/features/etfs/ui/EtfSummary';
import { getOneQuote } from '@/src/integrations/twelvedata/quote/service';
import { Interval } from '@/src/integrations/twelvedata/time_series/schema';
import { getOneTimeSeries } from '@/src/integrations/twelvedata/time_series/service';
import { buildEndDateForInterval, buildStartDateForDelay, Delay } from '@/src/lib/date';

export default async function Home() {
  const delay: Delay = '1D';
  const interval: Interval = '1h';

  const { date: endDateObj, iso: endDate } = buildEndDateForInterval(interval);
  const { iso: startDate } = buildStartDateForDelay(delay, interval, endDateObj);

  const timeSeries = await getOneTimeSeries({
    symbol: 'SPY',
    exchange: 'NYSE',
    interval,
    endDate,
    startDate,
  });

  const quoteData = await getOneQuote('SPY', 'NYSE');

  return (
    <main className="relative flex flex-col lg:flex-row gap-4 justify-center items-start pt-8">
      <div className="w-full flex flex-col gap-8">
        <EtfSummary etf={quoteData} />
        <ChartContainer
          dateDelay="1D"
          startDate={startDate}
          endDate={endDate}
          data={toCandleData(timeSeries)}
        />
      </div>
      <div className="flex flex-col w-auto lg:w-1/2">
        <EtfDetails etf={quoteData} />
      </div>
    </main>
  );
}
