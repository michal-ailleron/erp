import { apiGet, DEFAULT_PAGE_SIZE } from '@/lib/api-client'
import type { Invoice, InvoiceStatus, InvoiceType, Page } from '@/types/api'

export interface InvoiceQuery {
  page: number
  q: string
  type: InvoiceType | ''
  status: InvoiceStatus | ''
}

export const fetchInvoices = (query: InvoiceQuery) =>
  apiGet<Page<Invoice>>('/invoices', { ...query, pageSize: DEFAULT_PAGE_SIZE })
