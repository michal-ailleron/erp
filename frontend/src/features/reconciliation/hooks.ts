import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSettlement, fetchSuggestions, rejectSuggestion } from './api'

export function useSuggestions(transactionId: string | undefined) {
  return useQuery({
    queryKey: ['suggestions', transactionId],
    queryFn: () => fetchSuggestions(transactionId as string),
    enabled: transactionId !== undefined,
  })
}

/** Zatwierdzenie propozycji = utworzenie rozliczenia. Odświeża wszystko, co się przez to zmienia. */
export function useApproveSuggestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSettlement,
    onSuccess: () =>
      Promise.all(
        ['transactions', 'suggestions', 'invoices', 'dashboard'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      ),
  })
}

export function useRejectSuggestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectSuggestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suggestions'] }),
  })
}
