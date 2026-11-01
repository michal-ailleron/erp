import '@fontsource-variable/ibm-plex-sans'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { Providers } from '@/app/providers'
import { router } from '@/app/router'

/** Mocki są domyślnie włączone. Backend podłączysz przez VITE_USE_MOCKS=false. */
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS === 'false') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

const root = document.getElementById('root')
if (!root) throw new Error('Brak elementu #root w index.html')

void enableMocking().then(() => {
  createRoot(root).render(
    <StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </StrictMode>,
  )
})
