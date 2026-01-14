import { getDb } from '@/src/db';
import { etfsTable } from '@/src/db/schema';
import { toCandleData } from '@/src/features/charts/models/mapper';
import ChartContainer from '@/src/features/charts/ui/ChartContainer';
import EtfSummary from '@/src/features/etfs/ui/EtfSummary';
import { Interval } from '@/src/integrations/twelvedata/time_series/schema';
import { getOneTimeSeries } from '@/src/integrations/twelvedata/time_series/service';
import { buildEndDateForInterval, buildStartDateForDelay, Delay } from '@/src/lib/date';
import { and, eq } from 'drizzle-orm';

export default async function Home() {
  const delay: Delay = '1D';
  const interval: Interval = '1h';

  const { db } = await getDb();
  const dbResult = await db
    .select()
    .from(etfsTable)
    .where(and(eq(etfsTable.symbol, 'SPY'), eq(etfsTable.exchange, 'NYSE')));

  const { date: endDateObj, iso: endDate } = buildEndDateForInterval(interval);
  const { iso: startDate } = buildStartDateForDelay(delay, interval, endDateObj);

  const data = await getOneTimeSeries({
    symbol: 'SPY',
    exchange: 'NYSE',
    interval,
    endDate,
    startDate,
  });

  return (
    <main className="flex flex-col gap-8 justify-center items-center pt-8">
      <EtfSummary className="w-full" etf={dbResult[0]} />
      <ChartContainer
        dateDelay="1D"
        startDate={startDate}
        endDate={endDate}
        data={toCandleData(data)}
      />
    </main>
  );
}
