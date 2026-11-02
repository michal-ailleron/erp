import { apiGet, DEFAULT_PAGE_SIZE } from '@/lib/api-client'
import type { CounterpartyKind, CounterpartyPage } from '@/types/api'

export interface CounterpartyQuery {
  page: number
  q: string
  kind: CounterpartyKind | ''
}

export const fetchCounterparties = (query: CounterpartyQuery) =>
  apiGet<CounterpartyPage>('/counterparties', { ...query, pageSize: DEFAULT_PAGE_SIZE })
