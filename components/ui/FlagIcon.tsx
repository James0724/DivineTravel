import type { ReactElement, SVGProps } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { cn } from '@/lib/utils'

const flagMap = Flags as unknown as Record<string, (props: SVGProps<SVGSVGElement>) => ReactElement>

export default function FlagIcon({
  countryCode,
  className,
}: {
  countryCode: string
  className?: string
}) {
  const Flag = flagMap[countryCode]
  if (!Flag) return null
  return <Flag className={cn('inline-block shrink-0 rounded-[2px] overflow-hidden', className)} />
}
