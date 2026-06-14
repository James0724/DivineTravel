'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import type { Comment } from '@/types'

interface Props {
  postSlug: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Avatar({ url, name, size = 40 }: { url: string; name: string; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (!url || imgError) {
    return (
      <div
        className="rounded-full flex items-center justify-center font-sans font-semibold text-bone-forest flex-shrink-0"
        style={{ width: size, height: size, background: 'rgba(42,58,42,0.12)', fontSize: size * 0.35 }}
      >
        {initials}
      </div>
    )
  }
  return (
    <Image
      src={url}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover flex-shrink-0"
      onError={() => setImgError(true)}
      unoptimized
    />
  )
}

interface CommentItemProps {
  comment: Comment
  replies: Comment[]
  onReply: (id: string, name: string) => void
}

function CommentItem({ comment, replies, onReply }: CommentItemProps) {
  return (
    <div className="space-y-4">
      {/* Top-level comment */}
      <div className="flex gap-4">
        <Avatar url={comment.avatarUrl} name={comment.name} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="font-sans font-semibold text-[14px] text-bone-ink">{comment.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-bone-muted">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="font-sans text-[14px] leading-[1.7] text-bone-ink/80 whitespace-pre-wrap break-words">
            {comment.body}
          </p>
          <button
            onClick={() => onReply(comment._id, comment.name)}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-clay hover:text-bone-forest transition-colors"
          >
            ↩ Reply
          </button>

          {/* Admin reply */}
          {comment.adminReply && (
            <div
              className="mt-4 pl-4 py-3 pr-4 rounded-sm"
              style={{ borderLeft: '3px solid #9d4519', background: 'rgba(157,69,25,0.05)' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone-clay font-semibold">
                  Divine Travel Nest Safaris
                </span>
                <span className="font-mono text-[9px] text-bone-muted">
                  · {formatDate(comment.adminReply.repliedAt)}
                </span>
              </div>
              <p className="font-sans text-[13px] leading-[1.7] text-bone-ink/80 whitespace-pre-wrap break-words">
                {comment.adminReply.body}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Threaded replies */}
      {replies.length > 0 && (
        <div className="ml-14 space-y-4 pl-4" style={{ borderLeft: '1px solid rgba(31,29,24,0.14)' }}>
          {replies.map((reply) => (
            <div key={reply._id} className="flex gap-3">
              <Avatar url={reply.avatarUrl} name={reply.name} size={34} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span className="font-sans font-semibold text-[13px] text-bone-ink">{reply.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-bone-muted">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <p className="font-sans text-[13px] leading-[1.7] text-bone-ink/80 whitespace-pre-wrap break-words">
                  {reply.body}
                </p>

                {/* Admin reply on a nested comment */}
                {reply.adminReply && (
                  <div
                    className="mt-3 pl-3 py-2.5 pr-3 rounded-sm"
                    style={{ borderLeft: '3px solid #9d4519', background: 'rgba(157,69,25,0.05)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone-clay font-semibold">
                        Divine Travel Nest Safaris
                      </span>
                      <span className="font-mono text-[9px] text-bone-muted">
                        · {formatDate(reply.adminReply.repliedAt)}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] leading-[1.7] text-bone-ink/80 whitespace-pre-wrap break-words">
                      {reply.adminReply.body}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface FormState {
  name: string
  email: string
  commentBody: string
  subscribeToReplies: boolean
}

const INITIAL_FORM: FormState = { name: '', email: '', commentBody: '', subscribeToReplies: false }

export default function CommentSection({ postSlug }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [honeypot, setHoneypot] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setComments(json.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [postSlug])

  const topLevel = comments.filter((c) => !c.parentId)
  const getReplies = (id: string) => comments.filter((c) => c.parentId === id)

  function handleReply(id: string, name: string) {
    setReplyTo({ id, name })
    setSubmitMsg(null)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Please enter your name.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = 'Please enter a valid email address.'
    if (!form.commentBody.trim() || form.commentBody.trim().length < 5)
      errs.commentBody = 'Comment must be at least 5 characters.'
    if (form.commentBody.trim().length > 2000)
      errs.commentBody = 'Comment must be under 2000 characters.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          name: form.name.trim(),
          email: form.email.trim(),
          commentBody: form.commentBody.trim(),
          parentId: replyTo?.id ?? null,
          subscribeToReplies: form.subscribeToReplies,
          _hp: honeypot,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setSubmitMsg({ type: 'success', text: json.message })
        setForm(INITIAL_FORM)
        setReplyTo(null)
        setErrors({})
      } else {
        setSubmitMsg({ type: 'error', text: json.error ?? 'Something went wrong. Please try again.' })
      }
    } catch {
      setSubmitMsg({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{ maxWidth: '720px', margin: '72px auto 0', padding: '0 24px' }}
      id="comments"
    >
      <div style={{ borderTop: '1px solid rgba(31,29,24,0.14)', paddingTop: '56px' }}>

        {/* Section heading */}
        <h2
          className="font-serif font-normal tracking-[-0.02em] text-bone-ink mb-8"
          style={{ fontSize: 'clamp(26px, 3vw, 36px)' }}
        >
          {loading
            ? 'Comments'
            : topLevel.length === 0
            ? 'Be the first to comment'
            : `${comments.length} comment${comments.length !== 1 ? 's' : ''}`}
        </h2>

        {/* Comment list */}
        {!loading && topLevel.length > 0 && (
          <div className="space-y-8 mb-12">
            {topLevel.map((c) => (
              <CommentItem
                key={c._id}
                comment={c}
                replies={getReplies(c._id)}
                onReply={handleReply}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="space-y-4 mb-10">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-bone-ink/10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-bone-ink/10 rounded w-28" />
                  <div className="h-3 bg-bone-ink/8 rounded w-full" />
                  <div className="h-3 bg-bone-ink/8 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Reply form */}
        <div ref={formRef}>
          {replyTo && (
            <div
              className="flex items-center justify-between mb-5 px-4 py-2.5 rounded-sm"
              style={{ background: 'rgba(157,69,25,0.07)', border: '1px solid rgba(157,69,25,0.2)' }}
            >
              <span className="font-sans text-[13px] text-bone-ink/70">
                Replying to <strong className="text-bone-ink">{replyTo.name}</strong>
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted hover:text-bone-clay transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <h3
            className="font-serif font-normal tracking-[-0.015em] text-bone-ink mb-6"
            style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}
          >
            {replyTo ? 'Leave a reply' : 'Leave a reply'}
          </h3>

          <p className="font-sans text-[13px] text-bone-muted mb-6 leading-[1.6]">
            Your email address will not be published. Required fields are marked{' '}
            <span className="text-bone-clay">*</span>. Please keep discussions respectful — see our{' '}
            <a
              href="/contact"
              className="text-bone-clay hover:underline"
            >
              community guidelines
            </a>
            .
          </p>

          {submitMsg && (
            <div
              className={`mb-6 px-4 py-3 rounded-sm font-sans text-[13px] ${
                submitMsg.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {submitMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot — hidden from humans, bots fill it */}
            <input
              type="text"
              name="_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="comment-name"
                  className="block font-mono text-[10px] uppercase tracking-[0.12em] text-bone-ink/70 mb-1.5"
                >
                  Name <span className="text-bone-clay">*</span>
                </label>
                <input
                  id="comment-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }))
                    if (errors.name) setErrors((er) => ({ ...er, name: undefined }))
                  }}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full px-3.5 py-2.5 font-sans text-[14px] text-bone-ink bg-bone-paper border rounded-sm outline-none transition-colors focus:border-bone-clay"
                  style={{
                    border: errors.name ? '1px solid #dc2626' : '1px solid rgba(31,29,24,0.2)',
                  }}
                />
                {errors.name && (
                  <p className="mt-1 font-sans text-[11px] text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="comment-email"
                  className="block font-mono text-[10px] uppercase tracking-[0.12em] text-bone-ink/70 mb-1.5"
                >
                  Email <span className="text-bone-clay">*</span>
                </label>
                <input
                  id="comment-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }))
                    if (errors.email) setErrors((er) => ({ ...er, email: undefined }))
                  }}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 font-sans text-[14px] text-bone-ink bg-bone-paper border rounded-sm outline-none transition-colors focus:border-bone-clay"
                  style={{
                    border: errors.email ? '1px solid #dc2626' : '1px solid rgba(31,29,24,0.2)',
                  }}
                />
                {errors.email && (
                  <p className="mt-1 font-sans text-[11px] text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="comment-body"
                className="block font-mono text-[10px] uppercase tracking-[0.12em] text-bone-ink/70 mb-1.5"
              >
                Comment <span className="text-bone-clay">*</span>
              </label>
              <textarea
                id="comment-body"
                rows={5}
                value={form.commentBody}
                onChange={(e) => {
                  setForm((f) => ({ ...f, commentBody: e.target.value }))
                  if (errors.commentBody) setErrors((er) => ({ ...er, commentBody: undefined }))
                }}
                placeholder="Share your thoughts, questions, or experiences…"
                className="w-full px-3.5 py-2.5 font-sans text-[14px] text-bone-ink bg-bone-paper border rounded-sm outline-none transition-colors focus:border-bone-clay resize-y"
                style={{
                  border: errors.commentBody ? '1px solid #dc2626' : '1px solid rgba(31,29,24,0.2)',
                  minHeight: '120px',
                }}
              />
              <div className="flex justify-between mt-1">
                {errors.commentBody ? (
                  <p className="font-sans text-[11px] text-red-600">{errors.commentBody}</p>
                ) : (
                  <span />
                )}
                <span className="font-mono text-[10px] text-bone-muted">
                  {form.commentBody.length}/2000
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.subscribeToReplies}
                  onChange={(e) => setForm((f) => ({ ...f, subscribeToReplies: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-bone-clay flex-shrink-0"
                />
                <span className="font-sans text-[13px] text-bone-ink/70 leading-[1.5] group-hover:text-bone-ink/90 transition-colors">
                  Notify me of replies to my comment via email
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-sans text-[13px] font-medium text-bone-paper transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: '#2a3a2a' }}
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-bone-paper/30 border-t-bone-paper rounded-full animate-spin" />
                  Posting…
                </>
              ) : (
                'Post comment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
