import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Kontrahenci idą do prawdziwego backendu przez proxy Vite, reszta nadal z mocków.
export const worker = setupWorker(...handlers)
