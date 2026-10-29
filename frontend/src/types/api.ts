/**
 * Kontrakt API (po stronie backendu to będzie OpenAPI, a ten plik zastąpi
 * wygenerowany klient). Kwoty są ciągami dziesiętnymi, nigdy number.
 */

export type Currency = 'PLN' | 'EUR' | 'USD'

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export type CounterpartyKind = 'CUSTOMER' | 'SUPPLIER' | 'BOTH'

export interface Counterparty {
  id: string
  name: string
  taxId: string
  city: string
  kind: CounterpartyKind
  ibans: string[]
}

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
  /** Po terminie i nieopłacona. Liczy backend, frontend tylko wyświetla. */
  overdue: boolean
}

export type TransactionStatus = 'UNMATCHED' | 'MATCHED'

export interface BankTransaction {
  id: string
  bookingDate: string
  /** Dodatnia = wpływ, ujemna = obciążenie. */
  amount: string
  currency: Currency
  counterpartyName: string
  iban: string
  title: string
  status: TransactionStatus
}

/** Propozycja dopasowania (docelowo od agenta; teraz z mocków). */
export interface MatchSuggestion {
  id: string
  transactionId: string
  invoiceId: string
  invoiceNumber: string
  counterpartyName: string
  invoiceOpenAmount: string
  currency: Currency
  /** Różnica policzona przez backend: kwota transakcji minus kwota do zapłaty. */
  amountDifference: string
  /** 0..1 */
  confidence: number
  rationale: string
}

export interface DashboardSummary {
  openSalesTotal: string
  openCostTotal: string
  /** Należności minus zobowiązania. Liczy backend. */
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
  /** Kwota faktury faktycznie pokryta tą transakcją. Liczy backend. */
  appliedAmount: string
  invoiceNumber: string
}
