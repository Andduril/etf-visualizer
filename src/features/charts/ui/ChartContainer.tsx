'use client';

import { Interval, IntervalSchema } from '@/src/integrations/twelvedata/time_series/schema';
import { cn } from '@/src/lib/utils';
import { ComponentProps, useMemo, useState } from 'react';
import CandleChart from './CandleChart';
import { CandlestickData, Time } from 'lightweight-charts';
import { Delay } from '@/src/lib/date';

const delayItems: Delay[] = ['6M', '1M', '1W', '1D'];

type ChartContainerProps = ComponentProps<'div'> & {
  data: CandlestickData<Time>[];
  startDate: string;
  endDate: string;
  dateDelay: Delay;
};

const ChartContainer = ({
  data,
  startDate,
  endDate,
  dateDelay,
  className,
  ...props
}: ChartContainerProps) => {
  const [delay, setDelay] = useState<Delay>(dateDelay);

  const handleChangeDelay = (next: Delay) => {
    setDelay(next);
  };

  return (
    <div className={cn('w-full flex flex-col p-4 border-2 rounded-2xl', className)} {...props}>
      {/* Header */}
      <div className="h-14 flex justify-between items-center gap-4">
        <h3 className="text-lg font-semibold">TrendView</h3>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Period:</span>

          <nav aria-label="date range selection">
            <ul className="flex items-center gap-4 p-1">
              {delayItems.map((value) => (
                <li key={value} onClick={() => handleChangeDelay(value)}>
                  {value}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      {/* Chart */}
      <CandleChart
        data={data}
        className="w-full h-120"
        candleOptions={{
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        }}
        chartOptions={{
          layout: { textColor: 'white', background: { color: 'transparent' } },
          grid: {
            vertLines: {
              color: 'rgba(255,255,255,0.06)',
              style: 1,
              visible: true,
            },
            horzLines: {
              color: 'rgba(255,255,255,0.06)',
              style: 1,
              visible: true,
            },
          },
          timeScale: {
            rightOffset: 0, // supprime la marge à droite
            fixRightEdge: true, // colle le bord droit
            lockVisibleTimeRangeOnResize: true, // évite les surprises au resize
          },
        }}
      />
    </div>
  );
};

export default ChartContainer;
