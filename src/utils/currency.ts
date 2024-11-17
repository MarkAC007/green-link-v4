const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€'
};

export const formatCurrency = (amount: number | undefined, currency: string = 'GBP'): string => {
  if (amount === undefined) return 'Not specified';
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.GBP;
  return `${symbol}${amount.toLocaleString('en-GB')}`;
};