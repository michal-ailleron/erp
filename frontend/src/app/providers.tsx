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
  // useState: one client for the app's whole lifetime, not a new one on every render.
  const [queryClient] = useState(() => createQueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
