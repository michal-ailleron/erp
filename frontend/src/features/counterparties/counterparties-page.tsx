import { COUNTERPARTY_KIND_LABEL } from '@/components/status-badges'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
import { SelectField } from '@/components/ui/select-field'
import { formatIban } from '@/lib/format'
import { useListParams } from '@/lib/use-list-params'
import { parseOneOf } from '@/lib/utils'
import type { Counterparty, CounterpartyKind } from '@/types/api'
import { useCounterparties } from './hooks'

const KINDS = ['CUSTOMER', 'SUPPLIER', 'BOTH'] as const satisfies readonly CounterpartyKind[]

const KIND_OPTIONS = [
  { value: '', label: 'Wszyscy kontrahenci' },
  ...KINDS.map((value) => ({ value, label: COUNTERPARTY_KIND_LABEL[value] })),
]

const COLUMNS: readonly Column<Counterparty>[] = [
  { key: 'name', header: 'Nazwa', cell: (c) => <span className="font-medium">{c.name}</span> },
  { key: 'taxId', header: 'NIP', cell: (c) => <span className="num">{c.taxId}</span> },
  { key: 'city', header: 'Miasto', cell: (c) => c.city },
  { key: 'kind', header: 'Typ', cell: (c) => <Badge tone="info">{COUNTERPARTY_KIND_LABEL[c.kind]}</Badge> },
  {
    key: 'iban',
    header: 'Rachunek bankowy',
    cell: (c) => (
      <span className="num">
        {c.ibans[0] ? formatIban(c.ibans[0]) : 'Brak'}
        {c.ibans.length > 1 && <span className="text-ink-faint"> (+{c.ibans.length - 1})</span>}
      </span>
    ),
  },
]

export function CounterpartiesPage() {
  const { page, q, filters, setPage, setQuery, setFilter } = useListParams(['kind'] as const)
  const kind = parseOneOf(filters.kind, KINDS)
  const query = useCounterparties({ page, q, kind })

  return (
    <>
      <PageHeader title="Kontrahenci" description="Odbiorcy i dostawcy wraz z rachunkami bankowymi, po których rozpoznajemy płatności." />

      <div className="flex flex-wrap items-center gap-3 pb-4">
        <SearchInput label="Szukaj kontrahenta" placeholder="Nazwa, NIP lub miasto" value={q} onDebouncedChange={setQuery} />
        <SelectField label="Typ kontrahenta" value={kind} options={KIND_OPTIONS} onValueChange={(v) => setFilter('kind', v)} />
      </div>

      <DataTable
        caption="Lista kontrahentów"
        columns={COLUMNS}
        rows={query.data?.items}
        getRowKey={(c) => c.id}
        isLoading={query.isPending}
        errorMessage={query.error?.message}
        onRetry={() => void query.refetch()}
        emptyTitle="Nie znaleziono kontrahentów"
        emptyHint="Zmień wyszukiwany tekst albo wybierz inny typ kontrahenta."
      />

      {query.data && (
        <Pagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onPageChange={setPage} />
      )}
    </>
  )
}
