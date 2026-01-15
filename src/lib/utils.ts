import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrencySymbol(currency: string, locale = 'en-US'): string {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).formatToParts(1);

  const symbol = parts.find((p) => p.type === 'currency')?.value;

  if (!symbol) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  return symbol;
}
