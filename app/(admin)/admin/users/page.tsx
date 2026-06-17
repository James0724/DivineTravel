'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Users2,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  Clock,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Crown,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'
import Modal, { ConfirmDialog } from '@/components/ui/Modal'
import { cn, formatDate } from '@/lib/utils'

/* ── Types ─────────────────────────────────────────────────────────── */

type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  active: boolean
  lastLogin?: string
  createdAt: string
}

interface AddForm {
  name: string
  email: string
  password: string
  role: UserRole
  active: boolean
}

interface EditForm {
  name: string
  role: UserRole
  active: boolean
}

/* ── Constants ─────────────────────────────────────────────────────── */

const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  editor:      'Editor',
  viewer:      'Viewer',
}

const ROLE_COLOR: Record<UserRole, string> = {
  super_admin: 'bg-violet-50 text-violet-700 border-violet-200',
  admin:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  editor:      'bg-blue-50   text-blue-700   border-blue-200',
  viewer:      'bg-stone-50  text-stone-700  border-stone-200',
}

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin — full access + user management' },
  { value: 'admin',       label: 'Admin — manage all content'                  },
  { value: 'editor',      label: 'Editor — create & edit content'              },
  { value: 'viewer',      label: 'Viewer — read-only access'                   },
]

/* ── Initials helper ─────────────────────────────────────────────────── */

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

/* ── Role badge ──────────────────────────────────────────────────────── */

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full',
      'text-xs font-semibold border font-sans',
      ROLE_COLOR[role]
    )}>
      {role === 'super_admin' && <Crown size={10} />}
      {role !== 'super_admin' && <ShieldCheck size={10} />}
      {ROLE_LABEL[role]}
    </span>
  )
}

/* ── Password strength pills ─────────────────────────────────────────── */

function StrengthPills({ pw }: { pw: string }) {
  if (!pw) return null
  const checks = [
    { label: '8+ chars',  ok: pw.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(pw) },
    { label: 'Number',    ok: /\d/.test(pw) },
    { label: 'Symbol',    ok: /[^A-Za-z0-9]/.test(pw) },
  ]
  return (
    <div className="flex flex-wrap gap-1.5">
      {checks.map(({ label, ok }) => (
        <span key={label} className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans border',
          ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
             : 'bg-bone-bg text-bone-ink/40 border-[rgba(23,22,18,0.12)]'
        )}>
          {ok && <CheckCircle2 size={9} />}
          {label}
        </span>
      ))}
    </div>
  )
}

/* ── User row ────────────────────────────────────────────────────────── */

function UserRow({
  user,
  isSelf,
  onEdit,
  onDelete,
}: {
  user: AdminUser
  isSelf: boolean
  onEdit: (u: AdminUser) => void
  onDelete: (u: AdminUser) => void
}) {
  return (
    <div className={cn(
      'bg-bone-paper border border-[rgba(23,22,18,0.1)] rounded-md px-5 py-4',
      'transition-shadow hover:shadow-card',
      !user.active && 'opacity-60'
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

        {/* Avatar + Identity */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            'font-serif text-sm font-bold text-bone-paper flex-shrink-0',
            user.role === 'super_admin' ? 'bg-violet-600' : 'bg-bone-forest'
          )}>
            {user.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              : initials(user.name)
            }
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="font-sans font-semibold text-sm text-bone-ink truncate">{user.name}</p>
              {isSelf && (
                <span className="text-[10px] font-sans text-bone-ink/40 border border-[rgba(23,22,18,0.15)] px-1.5 py-0 rounded-full">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-sans text-bone-ink/50 mt-0.5">
              <Mail size={11} className="flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Role + status + dates */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5 flex-shrink-0">
          <RoleBadge role={user.role} />
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans border',
            user.active
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-stone-50 text-stone-500 border-stone-200'
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', user.active ? 'bg-green-500' : 'bg-stone-400')} />
            {user.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Dates */}
        <div className="hidden lg:flex flex-col gap-1 text-[11px] font-sans text-bone-ink/40 flex-shrink-0 min-w-[140px]">
          {user.lastLogin && (
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>Last login {formatDate(user.lastLogin, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>Joined {formatDate(user.createdAt, { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={13} />}
            onClick={() => onEdit(user)}
          >
            Edit
          </Button>
          {!isSelf && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={13} />}
              onClick={() => onDelete(user)}
              className="text-bone-ink/50 hover:text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Mobile dates row */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[rgba(23,22,18,0.06)] lg:hidden">
        {user.lastLogin && (
          <span className="flex items-center gap-1 text-[11px] font-sans text-bone-ink/40">
            <Clock size={10} />
            Last login {formatDate(user.lastLogin, { month: 'short', day: 'numeric' })}
          </span>
        )}
        <span className="flex items-center gap-1 text-[11px] font-sans text-bone-ink/40">
          <Calendar size={10} />
          Joined {formatDate(user.createdAt, { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

/* ── Loading skeleton ────────────────────────────────────────────────── */

function Skeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-bone-paper rounded animate-pulse" />
          <div className="h-4 w-64 bg-bone-paper rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-bone-paper rounded animate-pulse" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-bone-paper rounded-md animate-pulse" />
      ))}
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────────── */

const EMPTY_ADD: AddForm = { name: '', email: '', password: '', role: 'editor', active: true }
const EMPTY_EDIT: EditForm = { name: '', role: 'editor', active: true }

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [users,      setUsers]      = useState<AdminUser[]>([])
  const [loading,    setLoading]    = useState(true)
  const [addOpen,    setAddOpen]    = useState(false)
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null)
  const [delTarget,  setDelTarget]  = useState<AdminUser | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [showPw,     setShowPw]     = useState(false)
  const [addForm,    setAddForm]    = useState<AddForm>(EMPTY_ADD)
  const [addErrors,  setAddErrors]  = useState<Partial<AddForm & { form: string }>>({})
  const [editForm,   setEditForm]   = useState<EditForm>(EMPTY_EDIT)

  /* ── Auth guard ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (status !== 'loading' && session?.user?.role !== 'super_admin') {
      router.push('/admin')
    }
  }, [session, status, router])

  /* ── Fetch users ────────────────────────────────────────────────── */
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setUsers(data ?? [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  /* ── Add user ───────────────────────────────────────────────────── */
  const handleAdd = async () => {
    const errs: typeof addErrors = {}
    if (!addForm.name.trim())  errs.name     = 'Required'
    if (!addForm.email.trim()) errs.email    = 'Required'
    else if (!/\S+@\S+\.\S+/.test(addForm.email)) errs.email = 'Invalid email'
    if (!addForm.password)     errs.password = 'Required'
    else if (addForm.password.length < 8) errs.password = 'Min 8 characters'

    if (Object.keys(errs).length) { setAddErrors(errs); return }
    setAddErrors({})
    setSaving(true)
    try {
      const res  = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      toast.success(`${addForm.name} added successfully!`)
      setAddOpen(false)
      setAddForm(EMPTY_ADD)
      setUsers((u) => [body.data, ...u])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add user'
      if (msg.includes('already exists')) setAddErrors({ email: 'Email already in use' })
      else toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  /* ── Edit user ──────────────────────────────────────────────────── */
  const openEdit = (user: AdminUser) => {
    setEditTarget(user)
    setEditForm({ name: user.name, role: user.role, active: user.active })
  }

  const handleEdit = async () => {
    if (!editTarget) return
    setSaving(true)
    try {
      const res  = await fetch(`/api/admin/users/${editTarget._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error)
      toast.success('User updated!')
      setEditTarget(null)
      setUsers((u) => u.map((x) => x._id === editTarget._id ? body.data : x))
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  /* ── Delete user ────────────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!delTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${delTarget._id}`, { method: 'DELETE' })
      if (!res.ok) { const b = await res.json(); throw new Error(b.error) }
      toast.success(`${delTarget.name} removed`)
      setDelTarget(null)
      setUsers((u) => u.filter((x) => x._id !== delTarget._id))
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  /* ── Guards ─────────────────────────────────────────────────────── */
  if (status === 'loading' || loading || session?.user?.role !== 'super_admin') {
    return <Skeleton />
  }

  const selfId = session?.user?.id

  return (
    <div className="p-6 sm:p-8 space-y-5 max-w-4xl">

      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-bone-ink flex items-center gap-2">
            <Users2 size={20} className="text-bone-ink/40" />
            Users
            <span className="font-sans text-base font-normal text-bone-ink/35">
              ({users.length})
            </span>
          </h1>
          <p className="text-sm text-bone-ink/45 font-sans mt-1">
            Manage who can access the admin panel and what they can do.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus size={15} />}
          onClick={() => { setAddForm(EMPTY_ADD); setAddErrors({}); setAddOpen(true) }}
          className="flex-shrink-0 self-start"
        >
          Add User
        </Button>
      </div>

      {/* Super-admin notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-md bg-violet-50 border border-violet-200 text-violet-700">
        <Crown size={15} className="flex-shrink-0 mt-0.5" />
        <p className="text-xs font-sans">
          Only <strong>Super Admins</strong> can manage users. Role changes take effect after the affected user next signs in.
        </p>
      </div>

      {/* User list */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-bone-ink/35">
          <Users2 size={36} strokeWidth={1.2} />
          <p className="text-sm font-sans mt-3">No users found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              isSelf={user._id === selfId}
              onEdit={openEdit}
              onDelete={setDelTarget}
            />
          ))}
        </div>
      )}

      {/* ── Add User Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New User"
        description="Create a new admin panel account. Share the credentials securely."
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={addForm.name}
            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
            error={addErrors.name}
            required
            autoComplete="off"
          />
          <Input
            label="Email"
            type="email"
            value={addForm.email}
            onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
            error={addErrors.email}
            required
            autoComplete="off"
          />
          <div className="space-y-1.5">
            <Input
              label="Temporary Password"
              type={showPw ? 'text' : 'password'}
              value={addForm.password}
              onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
              error={addErrors.password}
              required
              autoComplete="new-password"
              rightAddon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((s) => !s)}
                  className="text-bone-ink/40 hover:text-bone-ink/70 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <StrengthPills pw={addForm.password} />
          </div>

          <Select
            label="Role"
            value={addForm.role}
            onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value as UserRole }))}
            options={ROLE_OPTIONS}
          />

          {/* Active toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => setAddForm((f) => ({ ...f, active: !f.active }))}
              className={cn(
                'w-9 h-5 rounded-full transition-colors duration-200 relative cursor-pointer',
                addForm.active ? 'bg-bone-forest' : 'bg-bone-ink/20'
              )}
            >
              <span className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                addForm.active ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </div>
            <span className="text-sm font-sans text-bone-ink/70">Active (can sign in)</span>
          </label>

          {addErrors.form && (
            <div className="flex items-center gap-2 text-red-600 text-xs font-sans">
              <AlertCircle size={13} /> {addErrors.form}
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2 border-t border-[rgba(23,22,18,0.08)]">
            <Button variant="secondary" size="sm" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              leftIcon={<UserPlus size={14} />}
              onClick={handleAdd}
            >
              Add User
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit User Modal ── */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={editTarget ? `Edit ${editTarget.name}` : 'Edit User'}
        description="Update name, role, or account status."
        size="sm"
      >
        {editTarget && (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              required
            />

            {editTarget._id === selfId ? (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-bone-ink/80 font-sans">Role</p>
                <div className="flex items-center gap-2 h-10 px-3 bg-bone-bg border border-[rgba(23,22,18,0.15)] rounded">
                  <RoleBadge role={editForm.role} />
                </div>
                <p className="text-xs text-bone-ink/45 font-sans flex items-center gap-1">
                  <AlertCircle size={11} /> You cannot change your own role.
                </p>
              </div>
            ) : (
              <Select
                label="Role"
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                options={ROLE_OPTIONS}
              />
            )}

            {/* Active toggle */}
            <label className={cn('flex items-center gap-2.5 select-none', editTarget._id === selfId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}>
              <div
                onClick={() => editTarget._id !== selfId && setEditForm((f) => ({ ...f, active: !f.active }))}
                className={cn(
                  'w-9 h-5 rounded-full transition-colors duration-200 relative',
                  editTarget._id === selfId ? 'cursor-not-allowed' : 'cursor-pointer',
                  editForm.active ? 'bg-bone-forest' : 'bg-bone-ink/20'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                  editForm.active ? 'translate-x-4' : 'translate-x-0.5'
                )} />
              </div>
              <span className="text-sm font-sans text-bone-ink/70">
                Active {editTarget._id === selfId && '(cannot deactivate self)'}
              </span>
            </label>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[rgba(23,22,18,0.08)]">
              <Button variant="secondary" size="sm" onClick={() => setEditTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={saving}
                leftIcon={<CheckCircle2 size={14} />}
                onClick={handleEdit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete confirm ── */}
      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Delete ${delTarget?.name ?? 'user'}?`}
        description={`This will permanently remove ${delTarget?.name} (${delTarget?.email}) from the admin panel. They will no longer be able to sign in.`}
        confirmLabel="Delete User"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  )
}
