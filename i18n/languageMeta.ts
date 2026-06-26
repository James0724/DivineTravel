import type { Locale } from './routing'

interface LanguageMeta {
  nativeName: string
  /** ISO 3166-1 alpha-2 country code used to look up the flag icon. */
  countryCode: string
}

export const LANGUAGE_META: Record<Locale, LanguageMeta> = {
  en: { nativeName: 'English', countryCode: 'GB' },
  fr: { nativeName: 'Français', countryCode: 'FR' },
  de: { nativeName: 'Deutsch', countryCode: 'DE' },
  es: { nativeName: 'Español', countryCode: 'ES' },
  ru: { nativeName: 'Русский', countryCode: 'RU' },
  zh: { nativeName: '中文', countryCode: 'CN' },
}
