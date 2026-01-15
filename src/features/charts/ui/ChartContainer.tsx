'use client';

import { cn } from '@/src/lib/utils';
import { ComponentProps, useState } from 'react';
import CandleChart from './CandleChart';
import { CandlestickData, Time } from 'lightweight-charts';
import { Delay } from '@/src/lib/date';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/src/components/ui/toggle-group';

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
    <Card className={cn('rounded-2xl backdrop-blur', className)} {...props}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <CardTitle className="text-xl font-semibold">TrendView</CardTitle>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Period</span>

          <ToggleGroup
            type="single"
            value={delay}
            onValueChange={(value) => value && handleChangeDelay(value as Delay)}
            className="rounded-xl border border-border/60 p-1"
          >
            {delayItems.map((value) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium',
                  'data-[state=on]:bg-muted',
                  'data-[state=on]:text-foreground'
                )}
              >
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="pt-2">
        <CandleChart
          data={data}
          className="w-full h-[400px]"
          candleOptions={{
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          }}
          chartOptions={{
            layout: {
              textColor: 'white',
              background: { color: 'transparent' },
            },
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
              rightOffset: 0,
              fixRightEdge: true,
              lockVisibleTimeRangeOnResize: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
