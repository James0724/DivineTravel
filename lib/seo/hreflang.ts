import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://divinetravelnestsafaris.com'

type Href = Parameters<typeof getPathname>[0]['href']

/**
 * Builds the `alternates.languages` hreflang map + self-canonical for a
 * route, for use in generateMetadata(). `href` mirrors what next-intl's
 * <Link> accepts: either a plain string path or { pathname, params } for
 * dynamic routes.
 */
export function buildAlternates(locale: string, href: Href) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${APP_URL}${getPathname({ locale: l, href })}`
  }
  languages['x-default'] = `${APP_URL}${getPathname({ locale: routing.defaultLocale, href })}`

  return {
    canonical: `${APP_URL}${getPathname({ locale, href })}`,
    languages,
  }
}
