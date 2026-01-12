'use client';

import {
  AreaData,
  AreaSeries,
  ColorType,
  createChart,
  Time,
  WhitespaceData,
} from 'lightweight-charts';
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

type ChartProps = {
  data: (AreaData<Time> | WhitespaceData<Time>)[];
  backgroundColor: string;
  lineColor: string;
  textColor: string;
  areaTopColor: string;
  areaBottomColor: string;
} & ComponentPropsWithoutRef<'div'>;

const Chart = ({
  data,
  backgroundColor,
  lineColor,
  textColor,
  areaTopColor,
  areaBottomColor,
  ...props
}: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef) return;

    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current!.clientWidth,
      height: 300,
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(data);

    const handleResize = () => {};

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

  return <div ref={chartContainerRef} {...props} />;
};

export default Chart;
