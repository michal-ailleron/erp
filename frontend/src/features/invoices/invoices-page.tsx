import { INVOICE_TYPE_LABEL, InvoiceStatusBadge } from '@/components/status-badges'
import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { SelectField } from '@/components/ui/select-field'
import { formatDate, formatMoney } from '@/lib/format'
import { useListParams } from '@/lib/use-list-params'
import { parseOneOf } from '@/lib/utils'
import type { Invoice, InvoiceStatus, InvoiceType } from '@/types/api'
import { useInvoices } from './hooks'

const TYPES = ['SALES', 'COST'] as const satisfies readonly InvoiceType[]
const STATUSES = ['OPEN', 'PARTIALLY_PAID', 'PAID'] as const satisfies readonly InvoiceStatus[]

const TYPE_OPTIONS = [
  { value: '', label: 'Wszystkie' },
  { value: 'SALES', label: 'Sprzedaż' },
  { value: 'COST', label: 'Koszty' },
] as const

const STATUS_OPTIONS = [
  { value: '', label: 'Każdy status' },
  { value: 'OPEN', label: 'Otwarte' },
  { value: 'PARTIALLY_PAID', label: 'Częściowo opłacone' },
  { value: 'PAID', label: 'Opłacone' },
]

const COLUMNS: readonly Column<Invoice>[] = [
  { key: 'number', header: 'Numer', cell: (i) => <span className="num font-medium">{i.number}</span> },
  { key: 'type', header: 'Typ', cell: (i) => INVOICE_TYPE_LABEL[i.type] },
  { key: 'counterparty', header: 'Kontrahent', cell: (i) => i.counterpartyName },
  { key: 'issued', header: 'Wystawiono', cell: (i) => <span className="num">{formatDate(i.issueDate)}</span> },
  { key: 'due', header: 'Termin', cell: (i) => <span className="num">{formatDate(i.dueDate)}</span> },
  { key: 'gross', header: 'Brutto', align: 'right', cell: (i) => formatMoney(i.grossAmount, i.currency) },
  { key: 'paid', header: 'Zapłacono', align: 'right', cell: (i) => formatMoney(i.paidAmount, i.currency) },
  { key: 'status', header: 'Status', cell: (i) => <InvoiceStatusBadge invoice={i} /> },
]

export function InvoicesPage() {
  const { page, q, filters, setPage, setQuery, setFilter } = useListParams(['type', 'status'] as const)
  const type = parseOneOf(filters.type, TYPES)
  const status = parseOneOf(filters.status, STATUSES)
  const query = useInvoices({ page, q, type, status })

  return (
    <>
      <PageHeader title="Faktury" description="Faktury sprzedaży i kosztowe wraz z tym, ile z nich już zapłacono." />

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <SegmentedControl legend="Rodzaj faktur" value={type} options={TYPE_OPTIONS} onValueChange={(v) => setFilter('type', v)} />
        <SelectField label="Status faktury" value={status} options={STATUS_OPTIONS} onValueChange={(v) => setFilter('status', v)} />
        <SearchInput label="Szukaj faktury" placeholder="Numer lub kontrahent" value={q} onDebouncedChange={setQuery} />
      </div>

      <DataTable
        caption="Lista faktur"
        columns={COLUMNS}
        rows={query.data?.items}
        getRowKey={(i) => i.id}
        isLoading={query.isPending}
        errorMessage={query.error?.message}
        onRetry={() => void query.refetch()}
        emptyTitle="Nie znaleziono faktur"
        emptyHint="Zmień filtry albo wyszukiwany tekst."
      />

      {query.data && (
        <Pagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onPageChange={setPage} />
      )}
    </>
  )
}
