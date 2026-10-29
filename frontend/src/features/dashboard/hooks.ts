import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api-client'
import type { DashboardSummary } from '@/types/api'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiGet<DashboardSummary>('/dashboard/summary'),
  })
}
