import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import MotionProvider from '@/components/ui/MotionProvider'
import { getContactSettings } from '@/lib/getSiteSettings'
import { getExchangeRates } from '@/lib/currency/getExchangeRates'
import { ExchangeRatesProvider } from '@/components/providers/ExchangeRatesProvider'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, rates] = await Promise.all([getContactSettings(), getExchangeRates()])

  return (
    <ExchangeRatesProvider rates={rates}>
      <MotionProvider>
        <Navbar settings={settings} />
        <main className="w-full min-w-0 [overflow-x:clip]">{children}</main>
        <Footer settings={settings} />
        <ScrollToTop />
      </MotionProvider>
    </ExchangeRatesProvider>
  )
}
