import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

const badgeVariants = cva('inline-flex items-center rounded-control px-2 py-0.5 text-xs font-medium whitespace-nowrap', {
  variants: {
    tone: {
      neutral: 'bg-rule-soft text-ink-soft',
      ok: 'bg-tick-soft text-tick',
      warn: 'bg-amber-soft text-amber',
      bad: 'bg-flag-soft text-flag',
      info: 'bg-pen-soft text-pen',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
}

export function Badge({ tone, children }: BadgeProps) {
  return <span className={badgeVariants({ tone })}>{children}</span>
}
