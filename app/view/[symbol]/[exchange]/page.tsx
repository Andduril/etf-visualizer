import { toCandleData } from '@/src/features/charts/models/mapper';
import CandleChart from '@/src/features/charts/ui/CandleChart';
import { isSupportedByFreePlan } from '@/src/integrations/twelvedata/http/client';
import { getOneTimeSeries } from '@/src/integrations/twelvedata/time_series/service';

type EtfViewPageProps = {
  params: Promise<{ symbol: string; exchange: string }>;
};

const EtfViewPage = async ({ params }: EtfViewPageProps) => {
  const { symbol, exchange } = await params;

  // Free api trial
  const isValid = isSupportedByFreePlan(exchange);
  if (!isValid) throw Error('Etf outside of US are not supported yet');

  const result = await getOneTimeSeries({ symbol: symbol, exchange: exchange, interval: '1day' });

  return (
    <main className="relative">
      <h1>{symbol}</h1>
      <h2>{result.values.length}</h2>
      <CandleChart
        className="w-full h-100"
        data={toCandleData(result)}
        candleOptions={{
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        }}
        chartOptions={{ layout: { textColor: 'white', background: { color: 'transparent' } } }}
      />
    </main>
  );
};

export default EtfViewPage;
