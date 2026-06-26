export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF',
  'KES', 'TZS', 'UGX', 'ZAR', 'RWF',
  'INR', 'AED', 'SGD', 'NZD', 'JPY', 'CNY', 'BRL', 'MXN',
] as const

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]

export const DEFAULT_CURRENCY: CurrencyCode = 'USD'

interface CurrencyMeta {
  name: string
  symbol: string
  /** ISO 3166-1 alpha-2 country code (or 'EU') used to look up the flag icon. */
  countryCode: string
}

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  USD: { name: 'US Dollar', symbol: '$', countryCode: 'US' },
  EUR: { name: 'Euro', symbol: '€', countryCode: 'EU' },
  GBP: { name: 'British Pound', symbol: '£', countryCode: 'GB' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', countryCode: 'CA' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', countryCode: 'AU' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', countryCode: 'CH' },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', countryCode: 'KE' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', countryCode: 'TZ' },
  UGX: { name: 'Ugandan Shilling', symbol: 'USh', countryCode: 'UG' },
  ZAR: { name: 'South African Rand', symbol: 'R', countryCode: 'ZA' },
  RWF: { name: 'Rwandan Franc', symbol: 'FRw', countryCode: 'RW' },
  INR: { name: 'Indian Rupee', symbol: '₹', countryCode: 'IN' },
  AED: { name: 'UAE Dirham', symbol: 'AED', countryCode: 'AE' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', countryCode: 'SG' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', countryCode: 'NZ' },
  JPY: { name: 'Japanese Yen', symbol: '¥', countryCode: 'JP' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', countryCode: 'CN' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', countryCode: 'BR' },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', countryCode: 'MX' },
}
