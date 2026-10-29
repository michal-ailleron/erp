import { apiGet, apiPost } from '@/lib/api-client'
import type { CreateSettlementRequest, MatchSuggestion, SettlementResult } from '@/types/api'

export const fetchSuggestions = (transactionId: string) =>
  apiGet<MatchSuggestion[]>(`/transactions/${transactionId}/suggestions`)

export const createSettlement = (request: CreateSettlementRequest) =>
  apiPost<SettlementResult>('/settlements', request)

export const rejectSuggestion = (suggestionId: string) =>
  apiPost<void>(`/suggestions/${suggestionId}/reject`)
