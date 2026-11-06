import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { createQueryClient } from './query-client'

export function Providers({ children }: { children: ReactNode }) {
  // useState: one client for the app's whole lifetime, not a new one on every render.
  const [queryClient] = useState(() => createQueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
