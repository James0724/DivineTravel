'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Star,
  Images,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  MessageSquare,
  UserCircle,
  Users2,
  BedDouble,
  Compass,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useAdminPendingBookingsCount } from '@/hooks/useBooking'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
  superAdminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard',    href: '/admin',            icon: LayoutDashboard, exact: true },
  { label: 'Safaris',      href: '/admin/safaris',    icon: Map },
  { label: 'Destinations', href: '/admin/destinations', icon: Compass },
  { label: 'Accommodations', href: '/admin/accommodations', icon: BedDouble },
  { label: 'Journal',      href: '/admin/journal',    icon: BookOpen },
  { label: 'Comments',     href: '/admin/comments',   icon: MessageSquare },
  { label: 'Bookings',     href: '/admin/bookings',   icon: CalendarCheck },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Media',        href: '/admin/media',      icon: Images },
  { label: 'Users',        href: '/admin/users',      icon: Users2,      superAdminOnly: true },
  { label: 'Settings',     href: '/admin/settings',   icon: Settings },
  { label: 'Profile',      href: '/admin/profile',    icon: UserCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { adminSidebarCollapsed, toggleAdminSidebar } = useUIStore()
  const { data: pendingCount = 0 } = useAdminPendingBookingsCount()
  const { data: session } = useSession()

  const isSuperAdmin = session?.user?.role === 'super_admin'

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-bone-forest text-bone-paper/80',
        'flex flex-col border-r border-bone-paper/10 z-30',
        'transition-all duration-300',
        adminSidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-bone-paper/10 flex-shrink-0',
          adminSidebarCollapsed ? 'justify-center px-2' : 'px-5'
        )}
      >
        {adminSidebarCollapsed ? (
          <div className="w-7 h-7 bg-bone-paper/15 rounded flex items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
              <path d="M16 4c0 0-8 6-8 13a8 8 0 0016 0C24 10 16 4 16 4z" fill="#f4efe2" fillOpacity="0.9" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-bone-paper/15 rounded flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
                <path d="M16 4c0 0-8 6-8 13a8 8 0 0016 0C24 10 16 4 16 4z" fill="#f4efe2" fillOpacity="0.9" />
              </svg>
            </div>
            <span className="font-serif text-sm font-semibold text-bone-paper truncate">
              Admin Panel
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5 px-2">
          {navItems.filter((item) => !item.superAdminOnly || isSuperAdmin).map(({ label, href, icon: Icon, exact, superAdminOnly }) => {
            const active = isActive(href, exact)
            const isBookings = label === 'Bookings'
            const showBadge = isBookings && pendingCount > 0
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={adminSidebarCollapsed ? (showBadge ? `${label} (${pendingCount} pending)` : label) : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans',
                    'transition-colors duration-150',
                    active
                      ? 'bg-bone-paper/15 text-bone-paper'
                      : 'text-bone-paper/60 hover:bg-bone-paper/10 hover:text-bone-paper/85',
                    adminSidebarCollapsed && 'justify-center'
                  )}
                >
                  <span className="relative flex-shrink-0">
                    <Icon size={17} />
                    {showBadge && adminSidebarCollapsed && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </span>
                  {!adminSidebarCollapsed && <span className="flex-1">{label}</span>}
                  {!adminSidebarCollapsed && superAdminOnly && !showBadge && (
                    <span className="text-[9px] text-bone-paper/25 font-sans uppercase tracking-widest">SA</span>
                  )}
                  {!adminSidebarCollapsed && showBadge && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-400 text-amber-900 font-bold text-[10px] leading-none">
                      {pendingCount > 99 ? '99+' : pendingCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 border-t border-bone-paper/10 p-2 space-y-0.5">

        {/* User identity card */}
        {session?.user && (
          <Link
            href="/admin/profile"
            title={adminSidebarCollapsed ? `${session.user.name ?? 'Profile'} — My Profile` : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-150',
              'hover:bg-bone-paper/10',
              isActive('/admin/profile') && 'bg-bone-paper/15',
              adminSidebarCollapsed ? 'justify-center' : 'mb-1'
            )}
          >
            <span className="w-7 h-7 rounded-full bg-bone-paper/15 flex items-center justify-center flex-shrink-0 font-serif text-xs font-bold text-bone-paper leading-none select-none">
              {userInitials}
            </span>
            {!adminSidebarCollapsed && (
              <span className="flex flex-col min-w-0">
                <span className="text-sm font-sans font-medium text-bone-paper/85 truncate leading-tight">
                  {session.user.name ?? 'Admin'}
                </span>
                <span className="text-[10px] font-sans text-bone-paper/40 capitalize leading-tight mt-0.5">
                  {session.user.role ?? 'user'}
                </span>
              </span>
            )}
          </Link>
        )}

        <Link
          href="/"
          target="_blank"
          title={adminSidebarCollapsed ? 'View site' : undefined}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans',
            'text-bone-paper/50 hover:bg-bone-paper/10 hover:text-bone-paper/80 transition-colors',
            adminSidebarCollapsed && 'justify-center'
          )}
        >
          <ExternalLink size={17} className="flex-shrink-0" />
          {!adminSidebarCollapsed && <span>View Site</span>}
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          title={adminSidebarCollapsed ? 'Sign out' : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans',
            'text-bone-paper/50 hover:bg-red-900/30 hover:text-red-300 transition-colors',
            adminSidebarCollapsed && 'justify-center'
          )}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!adminSidebarCollapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleAdminSidebar}
          title={adminSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-sans',
            'text-bone-paper/30 hover:text-bone-paper/60 transition-colors',
            adminSidebarCollapsed ? 'justify-center' : 'justify-end'
          )}
        >
          {adminSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <span>Collapse</span>
              <ChevronLeft size={14} />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
