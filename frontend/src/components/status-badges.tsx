import type { Invoice, TransactionStatus } from '@/types/api'
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
