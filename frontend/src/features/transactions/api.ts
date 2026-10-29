import { apiGet, DEFAULT_PAGE_SIZE } from '@/lib/api-client'
import type { BankTransaction, Page, TransactionStatus } from '@/types/api'

export interface TransactionQuery {
  page: number
  q: string
  status: TransactionStatus | ''
  pageSize?: number
}

export const fetchTransactions = (query: TransactionQuery) =>
  apiGet<Page<BankTransaction>>('/transactions', { pageSize: DEFAULT_PAGE_SIZE, ...query })
