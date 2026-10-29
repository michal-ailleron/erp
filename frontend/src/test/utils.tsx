import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { createQueryClient } from '@/app/providers'

/** Renderuje stronę z tymi samymi dostawcami co w aplikacji (React Query + router). */
export function renderPage(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  return render(
    <QueryClientProvider client={createQueryClient({ retry: false })}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}
