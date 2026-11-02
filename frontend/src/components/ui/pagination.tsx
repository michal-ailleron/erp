import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  if (total === 0) return null
  const pageCount = Math.ceil(total / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav aria-label="Stronicowanie" className="flex items-center justify-between gap-4 pt-4 text-sm text-ink-soft">
      <p aria-live="polite" className="num">
        Pozycje {from} do {to} z {total}
      </p>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft aria-hidden className="size-4" />
          Poprzednia
        </Button>
        <span className="num px-1">
          {page} / {pageCount}
        </span>
        <Button size="sm" variant="ghost" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Następna
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </div>
    </nav>
  )
}
