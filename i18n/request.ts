import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

const NAMESPACES = [
  'common',
  'home',
  'about',
  'contact',
  'destinations',
  'safariTypes',
  'accommodations',
  'planMySafari',
  'terms',
  'guidelines',
] as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const loaded = await Promise.all(
    NAMESPACES.map((ns) => import(`../messages/${locale}/${ns}.json`).then((m) => m.default))
  )

  const messages = Object.fromEntries(NAMESPACES.map((ns, i) => [ns, loaded[i]]))

  return { locale, messages }
})
