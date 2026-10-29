import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchServices, type ServiceQuery } from './api'

export function useServices(query: ServiceQuery) {
  return useQuery({
    queryKey: ['services', query],
    queryFn: () => fetchServices(query),
    placeholderData: keepPreviousData,
  })
}
