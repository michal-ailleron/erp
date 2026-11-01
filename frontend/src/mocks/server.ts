import { setupServer } from 'msw/node'
import { counterpartyHandlers, handlers } from './handlers'

export const server = setupServer(...counterpartyHandlers, ...handlers)
