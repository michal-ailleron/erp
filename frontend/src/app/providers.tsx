import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

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

export function Providers({ children }: { children: ReactNode }) {
  // useState: jeden klient na cały czas życia aplikacji, nie nowy przy każdym renderze.
  const [queryClient] = useState(() => createQueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
