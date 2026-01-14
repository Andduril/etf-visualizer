import { TimeSeriesValue } from './TimeSeriesValue';

export interface TimeSeries {
  symbol: string;
  values: TimeSeriesValue[];
}
