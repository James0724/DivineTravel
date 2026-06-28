'use client'

import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
  label?: string
}

const TRACK_SIZE = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
}

const KNOB_SIZE = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
}

const KNOB_TRANSLATE = {
  sm: 'translate-x-3.5',
  md: 'translate-x-4',
}

export default function Switch({ checked, onChange, disabled, size = 'md', label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone-clay focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        TRACK_SIZE[size],
        checked ? 'bg-bone-forest' : 'bg-stone-300'
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow transform transition-transform duration-200',
          KNOB_SIZE[size],
          checked ? KNOB_TRANSLATE[size] : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
