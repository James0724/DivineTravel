'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Trap focus & handle Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-bone-ink/50 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full bg-bone-paper border border-[rgba(23,22,18,0.15)]',
              'rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col',
              sizeClasses[size]
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-0 flex-shrink-0">
                <div>
                  {title && (
                    <h2
                      id="modal-title"
                      className="font-serif text-xl font-semibold text-bone-ink"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-bone-ink/55">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1.5 rounded text-bone-ink/40 hover:text-bone-ink hover:bg-bone-bg transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto px-6 py-6 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const confirmStyles = {
    danger: 'bg-red-700 text-white hover:bg-red-800',
    warning: 'bg-amber-600 text-white hover:bg-amber-700',
    default: 'bg-bone-forest text-bone-paper hover:bg-bone-forest/90',
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-bone-ink">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-bone-ink/60">{description}</p>
          )}
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 text-sm font-sans font-medium text-bone-ink border border-[rgba(23,22,18,0.2)] rounded hover:bg-bone-bg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'h-9 px-4 text-sm font-sans font-medium rounded transition-colors disabled:opacity-50',
              confirmStyles[variant]
            )}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
