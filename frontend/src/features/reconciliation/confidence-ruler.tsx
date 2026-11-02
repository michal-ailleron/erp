import { formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'

const SEGMENTS = 10

/** Confidence ruler, styled like a rule: ten ticks, color depends on the threshold. */
export function ConfidenceRuler({ value }: { value: number }) {
  const filled = Math.round(value * SEGMENTS)
  const tone = value >= 0.9 ? 'bg-tick' : value >= 0.6 ? 'bg-amber' : 'bg-flag'

  return (
    <div role="img" aria-label={`Pewność dopasowania ${formatPercent(value)}`} className="flex items-center gap-2">
      <div aria-hidden className="flex gap-0.5">
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span key={index} className={cn('h-4 w-1.5 rounded-full', index < filled ? tone : 'bg-rule-soft')} />
        ))}
      </div>
      <span aria-hidden className="num text-sm font-medium">
        {formatPercent(value)}
      </span>
    </div>
  )
}
