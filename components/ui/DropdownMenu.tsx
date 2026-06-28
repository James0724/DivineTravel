'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

interface DropdownMenuProps {
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
}

// Renders the menu panel into a portal so it always paints above the page,
// regardless of any ancestor's `overflow: hidden` (e.g. the table card).
export default function DropdownMenu({ items, align = 'right' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const positionPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setCoords({
      top: rect.bottom + 4,
      left: align === 'right' ? rect.right - 176 : rect.left,
    })
  }

  useEffect(() => {
    if (!open) return
    positionPanel()

    const onClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      ) {
        return
      }
      setOpen(false)
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onReposition = () => positionPanel()

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    window.addEventListener('scroll', onReposition, true)
    window.addEventListener('resize', onReposition)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
      window.removeEventListener('scroll', onReposition, true)
      window.removeEventListener('resize', onReposition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'p-1.5 rounded text-bone-ink/40 hover:text-bone-ink hover:bg-bone-bg transition-colors',
          open && 'bg-bone-bg text-bone-ink'
        )}
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="z-50 w-44 py-1 bg-bone-paper border border-[rgba(23,22,18,0.15)] rounded-md shadow-lg"
          >
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm font-sans text-left transition-colors',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  item.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-bone-ink/75 hover:bg-bone-bg hover:text-bone-ink'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}
