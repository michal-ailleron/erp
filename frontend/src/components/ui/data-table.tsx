import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { EmptyState, ErrorState } from './states'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  /** Kwoty i liczby wyrównujemy do prawej. */
  align?: 'left' | 'right'
}

interface DataTableProps<T> {
  /** Opis tabeli dla czytników ekranu. */
  caption: string
  columns: readonly Column<T>[]
  rows: readonly T[] | undefined
  getRowKey: (row: T) => string
  isLoading: boolean
  errorMessage?: string
  onRetry?: () => void
  emptyTitle: string
  emptyHint?: string
}

const SKELETON_ROWS = 6

/** Tabela w stylu księgi: linie zamiast kart, kwoty do prawej. */
export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowKey,
  isLoading,
  errorMessage,
  onRetry,
  emptyTitle,
  emptyHint,
}: DataTableProps<T>) {
  if (errorMessage) {
    return (
      <div className="border-y border-rule bg-sheet">
        <ErrorState message={errorMessage} onRetry={onRetry} />
      </div>
    )
  }

  if (!isLoading && rows?.length === 0) {
    return (
      <div className="border-y border-rule bg-sheet">
        <EmptyState title={emptyTitle} hint={emptyHint} />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border-y border-rule bg-sheet">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn('px-4 py-2.5 font-medium text-ink-soft', column.align === 'right' && 'text-right')}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody aria-busy={isLoading}>
          {isLoading || !rows
            ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <tr key={index} className="border-b border-rule-soft last:border-b-0">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <div className="h-4 rounded-control bg-rule-soft motion-safe:animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={getRowKey(row)} className="border-b border-rule-soft last:border-b-0 hover:bg-paper">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-4 py-3 align-top', column.align === 'right' && 'num text-right')}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
