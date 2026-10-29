import { TransactionStatusBadge } from '@/components/status-badges'
import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { formatDate, formatIban, formatMoney } from '@/lib/format'
import { useListParams } from '@/lib/use-list-params'
import { parseOneOf } from '@/lib/utils'
import type { BankTransaction, TransactionStatus } from '@/types/api'
import { useTransactions } from './hooks'

const STATUSES = ['UNMATCHED', 'MATCHED'] as const satisfies readonly TransactionStatus[]

const STATUS_OPTIONS = [
  { value: '', label: 'Wszystkie' },
  { value: 'UNMATCHED', label: 'Nierozliczone' },
  { value: 'MATCHED', label: 'Rozliczone' },
] as const

const COLUMNS: readonly Column<BankTransaction>[] = [
  { key: 'date', header: 'Data księgowania', cell: (t) => <span className="num">{formatDate(t.bookingDate)}</span> },
  {
    key: 'counterparty',
    header: 'Kontrahent',
    cell: (t) => (
      <>
        <span className="block font-medium">{t.counterpartyName}</span>
        <span className="num block text-xs text-ink-faint">{formatIban(t.iban)}</span>
      </>
    ),
  },
  { key: 'title', header: 'Tytuł przelewu', cell: (t) => t.title },
  { key: 'amount', header: 'Kwota', align: 'right', cell: (t) => <span className="font-medium">{formatMoney(t.amount, t.currency)}</span> },
  { key: 'status', header: 'Status', cell: (t) => <TransactionStatusBadge status={t.status} /> },
]

export function TransactionsPage() {
  const { page, q, filters, setPage, setQuery, setFilter } = useListParams(['status'] as const)
  const status = parseOneOf(filters.status, STATUSES)
  const query = useTransactions({ page, q, status })

  return (
    <>
      <PageHeader title="Transakcje" description="Przelewy zaimportowane z wyciągów bankowych. Wpływy mają kwotę dodatnią, obciążenia ujemną." />

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <SegmentedControl legend="Status transakcji" value={status} options={STATUS_OPTIONS} onValueChange={(v) => setFilter('status', v)} />
        <SearchInput label="Szukaj transakcji" placeholder="Kontrahent, tytuł lub rachunek" value={q} onDebouncedChange={setQuery} />
      </div>

      <DataTable
        caption="Lista transakcji bankowych"
        columns={COLUMNS}
        rows={query.data?.items}
        getRowKey={(t) => t.id}
        isLoading={query.isPending}
        errorMessage={query.error?.message}
        onRetry={() => void query.refetch()}
        emptyTitle="Nie znaleziono transakcji"
        emptyHint="Zmień filtry albo wyszukiwany tekst."
      />

      {query.data && (
        <Pagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onPageChange={setPage} />
      )}
    </>
  )
}
