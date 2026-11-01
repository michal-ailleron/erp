import type { ReactNode } from 'react'
import { Button } from './button'

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1 px-6 py-12">
      <p className="font-display text-lg text-ink">{title}</p>
      {hint && <p className="max-w-prose text-sm text-ink-soft">{hint}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-1 px-6 py-12">
      <p className="font-display text-lg text-flag">Nie udało się wczytać danych</p>
      <p className="max-w-prose text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <div className="pt-2">
          <Button onClick={onRetry}>Spróbuj ponownie</Button>
        </div>
      )}
    </div>
  )
}
