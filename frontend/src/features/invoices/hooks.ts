import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchInvoices, type InvoiceQuery } from './api'

export function useInvoices(query: InvoiceQuery) {
  return useQuery({
    queryKey: ['invoices', query],
    queryFn: () => fetchInvoices(query),
    placeholderData: keepPreviousData,
  })
}
