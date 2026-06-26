import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Run on everything except: /api, /admin (covers both the (admin) route
  // group and the standalone app/admin/login route — admin always stays
  // English/USD and unprefixed), Next internals, and any path containing a
  // dot (static files: icon.png, manifest.webmanifest, sitemap.xml, etc.)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
