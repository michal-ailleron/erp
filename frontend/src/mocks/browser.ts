import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Counterparties go to the real backend through the Vite proxy; the rest still comes from mocks.
export const worker = setupWorker(...handlers)
