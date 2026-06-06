'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-bone-forest flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-bone-paper/15 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
              <path d="M16 4c0 0-8 6-8 13a8 8 0 0016 0C24 10 16 4 16 4z" fill="#f4efe2" fillOpacity="0.9" />
              <circle cx="16" cy="24" r="2" fill="#9d4519" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-bone-paper">
            Divine Travel Nest Safaris
          </h1>
          <p className="text-bone-paper/55 text-sm font-sans mt-1">Admin Panel</p>
        </div>

        {/* Form */}
        <div className="bg-bone-paper rounded-lg border border-bone-paper/10 p-6 shadow-xl">
          <h2 className="font-serif text-lg font-semibold text-bone-ink mb-6">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="info@divinetravelnestsafaris.com"
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-bone-ink/40 hover:text-bone-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              leftIcon={<LogIn size={16} />}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-bone-paper/30 font-sans mt-6">
          © {new Date().getFullYear()} Divine Travel Nest Safaris Ltd
        </p>
      </div>
    </div>
  )
}
