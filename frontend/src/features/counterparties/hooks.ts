import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchCounterparties, type CounterpartyQuery } from './api'

export function useCounterparties(query: CounterpartyQuery) {
  return useQuery({
    queryKey: ['counterparties', query],
    queryFn: () => fetchCounterparties(query),
    placeholderData: keepPreviousData,
  })
}
