import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import MotionProvider from '@/components/ui/MotionProvider'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MotionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </MotionProvider>
  )
}
