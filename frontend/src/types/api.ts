/**
 * API contract. The source of truth is contract/openapi.yaml: types from the contract come from
 * `api.gen.ts` (npm run api:gen) and are re-exported here under stable names. The types below,
 * for which there is no contract yet, are maintained by hand and will move to OpenAPI along with their endpoints.
 * Amounts are decimal strings, never number.
 */
import type { components } from './api.gen'

export type Currency = 'PLN' | 'EUR' | 'USD'

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export type CounterpartyKind = components['schemas']['CounterpartyKind']
export type Counterparty = components['schemas']['Counterparty']
export type CounterpartyPage = components['schemas']['CounterpartyPage']

export interface Service {
  id: string
  name: string
  unit: string
  netPrice: string
  currency: Currency
  vatRate: number
}

export type InvoiceType = 'SALES' | 'COST'
export type InvoiceStatus = 'OPEN' | 'PARTIALLY_PAID' | 'PAID'

export interface Invoice {
  id: string
  number: string
  type: InvoiceType
  counterpartyId: string
  counterpartyName: string
  issueDate: string
  dueDate: string
  currency: Currency
  grossAmount: string
  paidAmount: string
  status: InvoiceStatus
  /** Past due and unpaid. Computed by the backend; the frontend only displays it. */
  overdue: boolean
}

export type TransactionStatus = 'UNMATCHED' | 'MATCHED'

export interface BankTransaction {
  id: string
  bookingDate: string
  /** Positive = inflow, negative = outflow. */
  amount: string
  currency: Currency
  counterpartyName: string
  iban: string
  title: string
  status: TransactionStatus
}

/** Match suggestion (eventually from an agent; for now from mocks). */
export interface MatchSuggestion {
  id: string
  transactionId: string
  invoiceId: string
  invoiceNumber: string
  counterpartyName: string
  invoiceOpenAmount: string
  currency: Currency
  /** Difference computed by the backend: transaction amount minus amount due. */
  amountDifference: string
  /** 0..1 */
  confidence: number
  rationale: string
}

export interface DashboardSummary {
  openSalesTotal: string
  openCostTotal: string
  /** Receivables minus payables. Computed by the backend. */
  netPosition: string
  currency: Currency
  unmatchedTransactions: number
  overdueInvoices: number
  aging: { label: string; count: number }[]
}

export interface CreateSettlementRequest {
  transactionId: string
  invoiceId: string
}

export interface SettlementResult {
  id: string
  /** Invoice amount actually covered by this transaction. Computed by the backend. */
  appliedAmount: string
  invoiceNumber: string
}
