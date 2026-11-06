import { QueryClient } from '@tanstack/react-query'

export function createQueryClient(options?: { retry?: boolean }) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
        retry: options?.retry === false ? false : 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}
