import { cn } from '@/lib/utils'

/** Ptaszek audytora. Z `animate` rysuje się po zatwierdzeniu rozliczenia. */
export function TickIcon({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-5', animate && 'tick-draw', className)}
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}
