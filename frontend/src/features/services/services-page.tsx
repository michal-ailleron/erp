import { DataTable, type Column } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
import { SearchInput } from '@/components/ui/search-input'
import { formatMoney } from '@/lib/format'
import { useListParams } from '@/lib/use-list-params'
import type { Service } from '@/types/api'
import { useServices } from './hooks'

const COLUMNS: readonly Column<Service>[] = [
  { key: 'name', header: 'Usługa', cell: (s) => <span className="font-medium">{s.name}</span> },
  { key: 'unit', header: 'Jednostka', cell: (s) => s.unit },
  { key: 'price', header: 'Cena netto', align: 'right', cell: (s) => formatMoney(s.netPrice, s.currency) },
  { key: 'vat', header: 'VAT', align: 'right', cell: (s) => `${s.vatRate}%` },
]

export function ServicesPage() {
  const { page, q, setPage, setQuery } = useListParams([] as const)
  const query = useServices({ page, q })

  return (
    <>
      <PageHeader title="Usługi" description="Katalog usług, z którego powstają pozycje na fakturach sprzedaży." />

      <div className="pb-4">
        <SearchInput label="Szukaj usługi" placeholder="Nazwa usługi" value={q} onDebouncedChange={setQuery} />
      </div>

      <DataTable
        caption="Katalog usług"
        columns={COLUMNS}
        rows={query.data?.items}
        getRowKey={(s) => s.id}
        isLoading={query.isPending}
        errorMessage={query.error?.message}
        onRetry={() => void query.refetch()}
        emptyTitle="Nie znaleziono usług"
        emptyHint="Zmień wyszukiwany tekst."
      />

      {query.data && (
        <Pagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onPageChange={setPage} />
      )}
    </>
  )
}
