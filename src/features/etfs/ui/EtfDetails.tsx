import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { QuoteDto } from '@/src/integrations/twelvedata/quote/schema';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';
import { ComponentProps } from 'react';

type EtfDetailsProps = ComponentProps<'div'> & {
  etf: QuoteDto;
};

function n(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : NaN;
}

function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatInt(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function formatPct(value: number, decimals = 2, showPlus = true): string {
  if (!Number.isFinite(value)) return '—';
  const sign = value > 0 && showPlus ? '+' : '';
  return `${sign}${formatNumber(value, decimals)}%`;
}

function formatMoney(value: number, currency: string): string {
  if (!Number.isFinite(value)) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // fallback si currency inconnue
    return `${formatNumber(value, 2)} ${currency}`;
  }
}

function changeTone(value: number): 'positive' | 'negative' | 'neutral' {
  if (!Number.isFinite(value) || value === 0) return 'neutral';
  return value > 0 ? 'positive' : 'negative';
}

function ChangeBadge({ value, suffix }: { value: number; suffix?: string }) {
  const tone = changeTone(value);
  return (
    <Badge
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone === 'positive' && 'bg-emerald-500/15 text-emerald-400',
        tone === 'negative' && 'bg-rose-500/15 text-rose-400',
        tone === 'neutral' && 'bg-muted text-muted-foreground'
      )}
    >
      {formatPct(value, 2, true)}
      {suffix ? <span className="opacity-80">&nbsp;({suffix})</span> : null}
    </Badge>
  );
}

const EtfDetails = async ({ etf, className, ...props }: EtfDetailsProps) => {
  const currency = etf.currency ?? 'USD';

  const open = n(etf.open);
  const high = n(etf.high);
  const low = n(etf.low);
  const close = n(etf.close);

  const prevClose = n(etf.previous_close);
  const change = Number.isFinite(n(etf.change)) ? n(etf.change) : close - prevClose;
  const pctChange = Number.isFinite(n(etf.percent_change))
    ? n(etf.percent_change)
    : (change / prevClose) * 100;

  // “Today” : close vs open (intraday)
  const todayChange = close - open;
  const todayPct = Number.isFinite(open) && open !== 0 ? (todayChange / open) * 100 : NaN;

  const volume = n(etf.volume);
  const avgVolume = n(etf.average_volume);

  const lastQuoteAt = n(etf.last_quote_at);
  const lastUpdateLabel = Number.isFinite(lastQuoteAt)
    ? format(new Date(lastQuoteAt * 1000), 'PPpp')
    : '—';

  const isMarketOpen = Boolean(etf.is_market_open);

  const wk = etf.fifty_two_week;
  const wkLow = n(wk?.low);
  const wkHigh = n(wk?.high);
  const fromHighPct =
    Number.isFinite(wkHigh) && wkHigh !== 0 && Number.isFinite(close)
      ? ((close - wkHigh) / wkHigh) * 100
      : NaN;

  return (
    <div className={cn('flex flex-col p-1 rounded-2xl gap-4', className)} {...props}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-medium text-muted-foreground">ETF details</h3>
      </div>

      <div className="flex flex-row justify-around gap-2 flex-wrap">
        {/* Market status */}
        <Card className="w-55 mb-2">
          <CardHeader>
            <CardTitle className="text-sm">Market</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  etf.is_market_open
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {etf.is_market_open ? 'Open' : 'Closed'}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground">
              Exchange: <span className="font-medium text-foreground">{etf.exchange}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              Currency: <span className="font-medium text-foreground">{etf.currency}</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="w-55 mb-2">
          <CardHeader>
            <CardTitle className="text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Today</span>
              <ChangeBadge value={todayPct} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Prev</span>
              <ChangeBadge value={pctChange} suffix="24h" />
            </div>
            <div className="text-xs text-muted-foreground">
              Open: {formatMoney(open, currency)} · Prev close: {formatMoney(prevClose, currency)}
            </div>
          </CardContent>
        </Card>

        {/* Day range */}
        <Card className="w-55 mb-2">
          <CardHeader>
            <CardTitle className="text-sm">Day range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Low</span>
              <span className="text-sm font-medium">{formatMoney(low, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">High</span>
              <span className="text-sm font-medium">{formatMoney(high, currency)}</span>
            </div>
            <div className="text-xs text-muted-foreground">Open: {formatMoney(open, currency)}</div>
          </CardContent>
        </Card>

        {/* 52-week range */}
        <Card className="w-55 mb-2">
          <CardHeader>
            <CardTitle className="text-sm">52-week range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">52W Low</span>
              <span className="text-sm font-medium">{formatMoney(wkLow, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">52W High</span>
              <span className="text-sm font-medium">{formatMoney(wkHigh, currency)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">From 52W High</span>
              <ChangeBadge value={fromHighPct} />
            </div>
          </CardContent>
        </Card>

        {/* Volume */}
        <Card className="w-55 mb-2">
          <CardHeader>
            <CardTitle className="text-sm">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Today</span>
              <span className="text-sm font-medium">{formatInt(volume)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Average</span>
              <span className="text-sm font-medium">{formatInt(avgVolume)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {Number.isFinite(volume) && Number.isFinite(avgVolume) && avgVolume !== 0
                ? `vs avg: ${formatPct((volume / avgVolume) * 100, 2, false)}`
                : '—'}
            </div>
          </CardContent>
        </Card>

        {/* Instrument meta */}
        <Card className="w-55 mb-2">
          <CardHeader>
            <CardTitle className="text-sm">Instrument</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Symbol</span>
              <span className="text-sm font-medium">{etf.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Exchange</span>
              <span className="text-sm font-medium">{etf.exchange}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">MIC</span>
              <span className="text-sm font-medium">{etf.mic_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Currency</span>
              <span className="text-sm font-medium">{currency}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EtfDetails;
