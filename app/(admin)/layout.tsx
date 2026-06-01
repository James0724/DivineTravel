import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import AdminSidebar from '@/components/layout/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Acacia Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-bone-bg overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto transition-all duration-300 ml-16 lg:ml-60">
        {children}
      </div>
    </div>
  )
}
