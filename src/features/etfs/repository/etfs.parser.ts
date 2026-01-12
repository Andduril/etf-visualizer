import { validEtf } from '../model/etfs.zod';
import { EtfInsertRow } from './etfs.repository';

function normOpt(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export function toEtfInsertRow(value: validEtf): EtfInsertRow {
  return {
    symbol: value.symbol,
    name: normOpt(value.name),
    currency: normOpt(value.currency),
    exchange: normOpt(value.exchange),
    micCode: value.micCode,
    country: normOpt(value.country),
    figiCode: normOpt(value.figiCode),
    cfiCode: normOpt(value.cfiCode),
    isin: normOpt(value.isin),
    cusip: normOpt(value.cusip),
  };
}
