import { apiGet, DEFAULT_PAGE_SIZE } from '@/lib/api-client'
import type { Page, Service } from '@/types/api'

export interface ServiceQuery {
  page: number
  q: string
}

export const fetchServices = (query: ServiceQuery) =>
  apiGet<Page<Service>>('/services', { ...query, pageSize: DEFAULT_PAGE_SIZE })
