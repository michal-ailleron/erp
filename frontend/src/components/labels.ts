import type { CounterpartyKind, InvoiceType } from '@/types/api'

export const COUNTERPARTY_KIND_LABEL: Record<CounterpartyKind, string> = {
  CUSTOMER: 'Odbiorca',
  SUPPLIER: 'Dostawca',
  BOTH: 'Odbiorca i dostawca',
}

export const INVOICE_TYPE_LABEL: Record<InvoiceType, string> = {
  SALES: 'Sprzedaż',
  COST: 'Koszt',
}
