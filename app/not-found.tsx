import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bone-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl font-semibold text-bone-ink/10 mb-4">404</p>
        <h1 className="font-serif text-2xl font-semibold text-bone-ink mb-3">
          This page wandered off
        </h1>
        <p className="text-bone-ink/55 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for may have moved or doesn&apos;t exist. Let&apos;s get you back to Africa.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-5 rounded bg-bone-forest text-bone-paper text-sm font-sans font-medium hover:bg-bone-forest/90 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
