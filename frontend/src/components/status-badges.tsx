import type { CounterpartyKind, Invoice, InvoiceType, TransactionStatus } from '@/types/api'
import { Badge } from './ui/badge'

export function InvoiceStatusBadge({ invoice }: { invoice: Invoice }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {invoice.status === 'PAID' && <Badge tone="ok">Opłacona</Badge>}
      {invoice.status === 'PARTIALLY_PAID' && <Badge tone="warn">Częściowo opłacona</Badge>}
      {invoice.status === 'OPEN' && <Badge>Otwarta</Badge>}
      {invoice.overdue && <Badge tone="bad">Po terminie</Badge>}
    </span>
  )
}

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  return status === 'MATCHED' ? <Badge tone="ok">Rozliczona</Badge> : <Badge tone="warn">Nierozliczona</Badge>
}

export const COUNTERPARTY_KIND_LABEL: Record<CounterpartyKind, string> = {
  CUSTOMER: 'Odbiorca',
  SUPPLIER: 'Dostawca',
  BOTH: 'Odbiorca i dostawca',
}

export const INVOICE_TYPE_LABEL: Record<InvoiceType, string> = {
  SALES: 'Sprzedaż',
  COST: 'Koszt',
}
