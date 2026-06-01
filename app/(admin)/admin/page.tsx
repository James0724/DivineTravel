import type { Metadata } from 'next'
import Link from 'next/link'
import { Map, CalendarCheck, Star, TrendingUp, DollarSign, MessageSquare, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import BookingModel from '@/lib/db/models/Booking'
import TestimonialModel from '@/lib/db/models/Testimonial'
import CommentModel from '@/lib/db/models/Comment'

export const metadata: Metadata = { title: 'Dashboard' }

async function getStats() {
  try {
    await connectDB()
    const [
      totalSafaris,
      activeSafaris,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalTestimonials,
      revenueAgg,
      totalComments,
      pendingComments,
    ] = await Promise.all([
      SafariModel.countDocuments(),
      SafariModel.countDocuments({ active: true }),
      BookingModel.countDocuments(),
      BookingModel.countDocuments({ status: 'pending' }),
      BookingModel.countDocuments({ status: 'confirmed' }),
      TestimonialModel.countDocuments(),
      BookingModel.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      CommentModel.countDocuments({ status: 'approved' }),
      CommentModel.countDocuments({ status: 'pending' }),
    ])

    return {
      totalSafaris,
      activeSafaris,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalTestimonials,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      totalComments,
      pendingComments,
    }
  } catch {
    return {
      totalSafaris: 0, activeSafaris: 0, totalBookings: 0,
      pendingBookings: 0, confirmedBookings: 0, totalTestimonials: 0, totalRevenue: 0,
      totalComments: 0, pendingComments: 0,
    }
  }
}

async function getRecentBookings() {
  try {
    await connectDB()
    return await BookingModel.find()
      .populate('safari', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  } catch {
    return []
  }
}

const statCards = (stats: Awaited<ReturnType<typeof getStats>>) => [
  { label: 'Total Safaris', value: stats.totalSafaris, sub: `${stats.activeSafaris} active`, icon: Map, href: '/admin/safaris', color: 'text-bone-forest bg-bone-forest/10' },
  { label: 'Total Bookings', value: stats.totalBookings, sub: `${stats.pendingBookings} pending`, icon: CalendarCheck, href: '/admin/bookings', color: 'text-blue-700 bg-blue-100' },
  { label: 'Confirmed', value: stats.confirmedBookings, sub: 'confirmed bookings', icon: TrendingUp, href: '/admin/bookings?status=confirmed', color: 'text-green-700 bg-green-100' },
  { label: 'Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(0)}k`, sub: 'from confirmed bookings', icon: DollarSign, href: '/admin/bookings', color: 'text-bone-clay bg-bone-clay/10' },
  { label: 'Testimonials', value: stats.totalTestimonials, sub: 'guest reviews', icon: Star, href: '/admin/testimonials', color: 'text-amber-700 bg-amber-100' },
  { label: 'Comments', value: stats.totalComments, sub: `${stats.pendingComments} awaiting review`, icon: MessageSquare, href: '/admin/comments', color: 'text-indigo-700 bg-indigo-100' },
]

export default async function AdminDashboard() {
  const [stats, recentBookings] = await Promise.all([getStats(), getRecentBookings()])

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-bone-ink">Dashboard</h1>
        <p className="text-sm text-bone-ink/50 font-sans mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Pending comments alert */}
      {stats.pendingComments > 0 && (
        <Link
          href="/admin/comments?status=pending"
          className="flex items-center gap-3 px-4 py-3 rounded-md bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <span className="text-sm font-sans font-medium text-amber-700">
            {stats.pendingComments} comment{stats.pendingComments !== 1 ? 's' : ''} awaiting moderation
          </span>
          <span className="ml-auto text-xs font-sans text-amber-600">Review →</span>
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards(stats).map(({ label, value, sub, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card hover className="flex flex-col gap-3">
              <div className={`w-9 h-9 rounded flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-bone-ink">{value}</p>
                <p className="text-xs font-sans text-bone-ink/50 font-medium">{label}</p>
                <p className="text-xs font-sans text-bone-ink/35 mt-0.5">{sub}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-bone-ink">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs font-sans text-bone-ink/50 hover:text-bone-clay transition-colors">
            View all →
          </Link>
        </div>
        <div className="bg-bone-paper border border-[rgba(23,22,18,0.12)] rounded-md overflow-hidden">
          {recentBookings.length === 0 ? (
            <div className="py-12 text-center text-bone-ink/40 text-sm font-sans">
              No bookings yet
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Guest</th>
                  <th>Safari</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((raw) => {
                  const b = raw as Record<string, unknown>
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-100 text-amber-700',
                    confirmed: 'bg-green-100 text-green-700',
                    cancelled: 'bg-red-100 text-red-700',
                    completed: 'bg-bone-forest/10 text-bone-forest',
                  }
                  return (
                    <tr key={b._id as string}>
                      <td className="font-mono text-xs">{b.bookingRef as string}</td>
                      <td>{b.firstName as string} {b.lastName as string}</td>
                      <td className="text-bone-ink/60">
                        {(b.safari as { name?: string })?.name ?? '—'}
                      </td>
                      <td className="text-bone-ink/60">
                        {new Date(b.preferredDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="font-medium">${(b.totalPrice as number).toLocaleString()}</td>
                      <td>
                        <span className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full ${statusColors[b.status as string] ?? 'bg-stone-100 text-stone-600'}`}>
                          {b.status as string}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-bone-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/safaris/new"
            className="inline-flex items-center gap-2 h-10 px-4 rounded bg-bone-forest text-bone-paper text-sm font-sans font-medium hover:bg-bone-forest/90 transition-colors"
          >
            <Map size={15} />
            Add New Safari
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 h-10 px-4 rounded border border-[rgba(23,22,18,0.2)] text-bone-ink text-sm font-sans font-medium hover:bg-bone-bg transition-colors"
          >
            <CalendarCheck size={15} />
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  )
}
