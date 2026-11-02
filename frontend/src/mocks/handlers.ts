/**
 * Mock backendu REST. Odpowiada kontraktowi z src/types/api.ts.
 * Gdy powstanie prawdziwe API (Spring Boot), te endpointy trzeba zaimplementować
 * po stronie ERP: ten plik jest wykonywalną specyfikacją.
 */
import { delay, http, HttpResponse } from 'msw'
import type {
  CreateSettlementRequest,
  DashboardSummary,
  Page,
} from '@/types/api'
import { daysBetween, fromCents, REFERENCE_DATE, toCents } from './data/seed'
import { getDb } from './db'

const latency = () => (import.meta.env.MODE === 'test' ? Promise.resolve() : delay(250))

function paginate<T>(items: T[], url: URL): Page<T> {
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize')) || 10))
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total: items.length,
  }
}

function matchesText(q: string | null, ...fields: string[]): boolean {
  if (!q) return true
  const needle = q.toLowerCase()
  return fields.some((field) => field.toLowerCase().includes(needle))
}

function error(status: number, message: string) {
  return HttpResponse.json({ message }, { status })
}

/**
 * Kontrahenci mają już prawdziwy endpoint w backendzie (contract/openapi.yaml), więc przeglądarka
 * go nie mockuje (patrz browser.ts). Testy (server.ts) nadal go używają, żeby działały bez backendu.
 */
export const counterpartyHandlers = [
  http.get('/api/counterparties', async ({ request }) => {
    await latency()
    const url = new URL(request.url)
    const q = url.searchParams.get('q')
    const kind = url.searchParams.get('kind')
    const items = getDb().counterparties.filter(
      (c) => (!kind || c.kind === kind) && matchesText(q, c.name, c.taxId, c.city),
    )
    return HttpResponse.json(paginate(items, url))
  }),
]

/** Endpointy, których backend jeszcze nie implementuje. */
export const handlers = [
  http.get('/api/services', async ({ request }) => {
    await latency()
    const url = new URL(request.url)
    const items = getDb().services.filter((s) => matchesText(url.searchParams.get('q'), s.name))
    return HttpResponse.json(paginate(items, url))
  }),

  http.get('/api/invoices', async ({ request }) => {
    await latency()
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const status = url.searchParams.get('status')
    const items = getDb().invoices.filter(
      (i) =>
        (!type || i.type === type) &&
        (!status || i.status === status) &&
        matchesText(url.searchParams.get('q'), i.number, i.counterpartyName),
    )
    return HttpResponse.json(paginate(items, url))
  }),

  http.get('/api/transactions', async ({ request }) => {
    await latency()
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const items = getDb().transactions.filter(
      (t) =>
        (!status || t.status === status) &&
        matchesText(url.searchParams.get('q'), t.counterpartyName, t.title, t.iban),
    )
    return HttpResponse.json(paginate(items, url))
  }),

  http.get('/api/transactions/:id/suggestions', async ({ params }) => {
    await latency()
    const items = getDb()
      .suggestions.filter((s) => s.transactionId === params['id'])
      .sort((a, b) => b.confidence - a.confidence)
    return HttpResponse.json(items)
  }),

  http.get('/api/dashboard/summary', async () => {
    await latency()
    const { invoices, transactions } = getDb()
    const open = invoices.filter((i) => i.status !== 'PAID' && i.currency === 'PLN')
    const sum = (type: 'SALES' | 'COST') =>
      open
        .filter((i) => i.type === type)
        .reduce((acc, i) => acc + toCents(i.grossAmount) - toCents(i.paidAmount), 0)

    const buckets = [
      { label: 'W terminie', count: 0 },
      { label: '1 do 30 dni po terminie', count: 0 },
      { label: '31 do 60 dni po terminie', count: 0 },
      { label: 'Ponad 60 dni po terminie', count: 0 },
    ]
    for (const invoice of invoices.filter((i) => i.status !== 'PAID')) {
      const late = daysBetween(invoice.dueDate, REFERENCE_DATE)
      const index = late <= 0 ? 0 : late <= 30 ? 1 : late <= 60 ? 2 : 3
      const bucket = buckets[index]
      if (bucket) bucket.count += 1
    }

    const summary: DashboardSummary = {
      openSalesTotal: fromCents(sum('SALES')),
      openCostTotal: fromCents(sum('COST')),
      netPosition: fromCents(sum('SALES') - sum('COST')),
      currency: 'PLN',
      unmatchedTransactions: transactions.filter((t) => t.status === 'UNMATCHED').length,
      overdueInvoices: invoices.filter((i) => i.overdue).length,
      aging: buckets,
    }
    return HttpResponse.json(summary)
  }),

  http.post('/api/settlements', async ({ request }) => {
    await latency()
    const body = (await request.json()) as CreateSettlementRequest
    const db = getDb()
    const tx = db.transactions.find((t) => t.id === body.transactionId)
    const invoice = db.invoices.find((i) => i.id === body.invoiceId)
    if (!tx || !invoice) return error(404, 'Nie znaleziono transakcji lub faktury.')
    if (tx.status === 'MATCHED') return error(409, 'Ta transakcja jest już rozliczona.')
    if (invoice.status === 'PAID') return error(409, 'Ta faktura jest już opłacona.')

    const openCents = toCents(invoice.grossAmount) - toCents(invoice.paidAmount)
    const appliedCents = Math.min(openCents, Math.abs(toCents(tx.amount)))
    const paidCents = toCents(invoice.paidAmount) + appliedCents

    invoice.paidAmount = fromCents(paidCents)
    invoice.status = paidCents >= toCents(invoice.grossAmount) ? 'PAID' : 'PARTIALLY_PAID'
    invoice.overdue = invoice.status !== 'PAID' && invoice.dueDate < REFERENCE_DATE
    tx.status = 'MATCHED'
    db.suggestions = db.suggestions.filter((s) => s.transactionId !== tx.id)

    return HttpResponse.json(
      { id: `st-${tx.id}`, appliedAmount: fromCents(appliedCents), invoiceNumber: invoice.number },
      { status: 201 },
    )
  }),

  http.post('/api/suggestions/:id/reject', async ({ params }) => {
    await latency()
    const db = getDb()
    db.suggestions = db.suggestions.filter((s) => s.id !== params['id'])
    return new HttpResponse(null, { status: 204 })
  }),
]
