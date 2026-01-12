import {
  CandlestickData,
  CandlestickSeries,
  CandlestickStyleOptions,
  createChart,
  DeepPartial,
  SeriesOptionsCommon,
  Time,
  TimeChartOptions,
  WhitespaceData,
} from 'lightweight-charts';
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

type CandleChartProps = {
  data: (CandlestickData<Time> | WhitespaceData<Time>)[];
  chartOptions: DeepPartial<TimeChartOptions>;
  candleOptions: DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon>;
} & ComponentPropsWithoutRef<'div'>;

const CandleChart = ({ data, chartOptions, candleOptions, ...props }: CandleChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef) return;

    const chart = createChart(chartContainerRef.current!, chartOptions);
    const series = chart.addSeries(CandlestickSeries, candleOptions);
    series.setData(data);

    const handleResize = () => {};

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data, chartOptions, candleOptions]);

  return <div ref={chartContainerRef} {...props} />;
};

export default CandleChart;
