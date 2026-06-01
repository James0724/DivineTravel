import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-bone-ink/80 font-sans"
          >
            {label}
            {props.required && (
              <span className="text-bone-clay ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 text-bone-ink/40 pointer-events-none">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 px-3 font-sans text-sm text-bone-ink',
              'bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded',
              'placeholder:text-bone-ink/35',
              'transition-colors duration-150',
              'focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30',
              'disabled:bg-bone-bg disabled:cursor-not-allowed disabled:opacity-60',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
              leftAddon && 'pl-9',
              rightAddon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 text-bone-ink/40">
              {rightAddon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 font-sans">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-bone-ink/50 font-sans">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, rows = 4, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-bone-ink/80 font-sans"
          >
            {label}
            {props.required && (
              <span className="text-bone-clay ml-0.5">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full px-3 py-2.5 font-sans text-sm text-bone-ink',
            'bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded resize-y',
            'placeholder:text-bone-ink/35',
            'transition-colors duration-150',
            'focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30',
            'disabled:bg-bone-bg disabled:cursor-not-allowed',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-sans">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-bone-ink/50 font-sans">{hint}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ─── Select ───────────────────────────────────────────────────────────────────

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  placeholder?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, placeholder, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-bone-ink/80 font-sans"
          >
            {label}
            {props.required && (
              <span className="text-bone-clay ml-0.5">*</span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 px-3 font-sans text-sm text-bone-ink',
            'bg-bone-paper border border-[rgba(23,22,18,0.2)] rounded',
            'transition-colors duration-150 appearance-none',
            'focus:outline-none focus:border-bone-forest focus:ring-1 focus:ring-bone-forest/30',
            'disabled:bg-bone-bg disabled:cursor-not-allowed',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600 font-sans">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-bone-ink/50 font-sans">{hint}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export default Input
