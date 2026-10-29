/**
 * Deterministyczne dane syntetyczne dla mocków (ten sam seed = te same dane).
 * Wszystkie nazwy firm, numery NIP i rachunki są zmyślone.
 *
 * Uwaga: arytmetyka na groszach jest tu dozwolona, bo mock ODGRYWA ROLĘ
 * BACKENDU. W kodzie aplikacji (src/features, src/components) kwot się nie liczy.
 */
import type {
  BankTransaction,
  Counterparty,
  Currency,
  Invoice,
  InvoiceType,
  MatchSuggestion,
  Service,
  TransactionStatus,
} from '@/types/api'

export const REFERENCE_DATE = '2026-10-29'

export interface Db {
  counterparties: Counterparty[]
  services: Service[]
  invoices: Invoice[]
  transactions: BankTransaction[]
  suggestions: MatchSuggestion[]
}

/* ---------- pomocnicze: grosze i daty (tylko mocki) ---------- */

export const toCents = (amount: string): number => Math.round(Number(amount) * 100)
export const fromCents = (cents: number): string => (cents / 100).toFixed(2)

const MS_DAY = 86_400_000

export function addDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * MS_DAY).toISOString().slice(0, 10)
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(toIso) - Date.parse(fromIso)) / MS_DAY)
}

/* ---------- pomocnicze: generator liczb pseudolosowych ---------- */

type Rng = () => number

function createRng(initialSeed: number): Rng {
  let seed = initialSeed
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const int = (rng: Rng, min: number, max: number): number =>
  min + Math.floor(rng() * (max - min + 1))

const digits = (rng: Rng, n: number): string =>
  Array.from({ length: n }, () => int(rng, 0, 9)).join('')

function pick<T>(rng: Rng, items: readonly T[]): T {
  const item = items[int(rng, 0, items.length - 1)]
  if (item === undefined) throw new Error('pick: pusta lista')
  return item
}

function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = int(rng, 0, i)
    const a = result[i]
    const b = result[j]
    if (a === undefined || b === undefined) continue
    result[i] = b
    result[j] = a
  }
  return result
}

function must<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message)
  return value
}

/* ---------- dane słownikowe ---------- */

const COUNTERPARTY_SEED = [
  ['Nordwind Logistyka Sp. z o.o.', 'Gdańsk', 'CUSTOMER'],
  ['Pracownia Kartograficzna Lumen', 'Kraków', 'CUSTOMER'],
  ['Browar Dolina Sp. k.', 'Wrocław', 'CUSTOMER'],
  ['Studio Okiennica Sp. z o.o.', 'Poznań', 'CUSTOMER'],
  ['Kalinowski Transport', 'Łódź', 'CUSTOMER'],
  ['Bałtyckie Chłodnie S.A.', 'Szczecin', 'CUSTOMER'],
  ['Technika Grzewcza Orzeł', 'Katowice', 'BOTH'],
  ['Agencja Reklamowa Pion', 'Warszawa', 'SUPPLIER'],
  ['Hurtownia Tulipan Sp. z o.o.', 'Lublin', 'BOTH'],
  ['Warsztat Optyki Prosta', 'Białystok', 'CUSTOMER'],
  ['Chmura Serwis Sp. z o.o.', 'Warszawa', 'SUPPLIER'],
  ['Biuro Rachunkowe Bilans', 'Łódź', 'SUPPLIER'],
] as const

const SERVICE_SEED: readonly (readonly [string, string, number, Currency])[] = [
  ['Wdrożenie modułu finansowego', 'godz.', 22000, 'PLN'],
  ['Konsultacje analityczne', 'godz.', 18000, 'PLN'],
  ['Szkolenie użytkowników', 'dzień', 240000, 'PLN'],
  ['Utrzymanie systemu (abonament)', 'mies.', 450000, 'PLN'],
  ['Migracja danych', 'zlecenie', 1200000, 'PLN'],
  ['Audyt konfiguracji', 'zlecenie', 680000, 'PLN'],
  ['Licencja roczna', 'rok', 3600000, 'PLN'],
  ['Wsparcie powdrożeniowe', 'godz.', 15000, 'PLN'],
  ['Implementation support', 'h', 4500, 'EUR'],
]

/* ---------- główny generator ---------- */

export function createSeed(): Db {
  const rng = createRng(20261029)

  const counterparties: Counterparty[] = COUNTERPARTY_SEED.map(([name, city, kind], i) => ({
    id: `cp-${String(i + 1).padStart(2, '0')}`,
    name,
    city,
    kind,
    taxId: `${int(rng, 1, 9)}${digits(rng, 9)}`,
    ibans: Array.from({ length: int(rng, 1, 2) }, () => `PL${digits(rng, 26)}`),
  }))
  const cpById = new Map(counterparties.map((c) => [c.id, c]))

  const services: Service[] = SERVICE_SEED.map(([name, unit, netCents, currency], i) => ({
    id: `svc-${String(i + 1).padStart(2, '0')}`,
    name,
    unit,
    netPrice: fromCents(netCents),
    currency,
    vatRate: 23,
  }))

  /* --- faktury --- */
  const rawInvoices = Array.from({ length: 48 }, () => {
    const cp = pick(rng, counterparties)
    const type: InvoiceType =
      cp.kind === 'CUSTOMER' ? 'SALES' : cp.kind === 'SUPPLIER' ? 'COST' : rng() < 0.5 ? 'SALES' : 'COST'
    const issueDate = addDays('2026-08-03', int(rng, 0, 78))
    return {
      cp,
      type,
      issueDate,
      dueDate: addDays(issueDate, rng() < 0.5 ? 14 : 30),
      currency: (rng() < 0.15 ? 'EUR' : 'PLN') as Currency,
      grossCents: int(rng, 90_000, 9_500_000),
      supplierPrefix: int(rng, 10, 99),
    }
  }).sort((a, b) => a.issueDate.localeCompare(b.issueDate))

  const counters = { SALES: 0, COST: 0 }
  const invoices: Invoice[] = rawInvoices.map((raw, i) => {
    counters[raw.type] += 1
    const seq = counters[raw.type]
    const number =
      raw.type === 'SALES'
        ? `FS/2026/${raw.issueDate.slice(5, 7)}/${String(seq).padStart(4, '0')}`
        : `FV ${raw.supplierPrefix}/${seq}/2026`
    return {
      id: `inv-${String(i + 1).padStart(3, '0')}`,
      number,
      type: raw.type,
      counterpartyId: raw.cp.id,
      counterpartyName: raw.cp.name,
      issueDate: raw.issueDate,
      dueDate: raw.dueDate,
      currency: raw.currency,
      grossAmount: fromCents(raw.grossCents),
      paidAmount: '0.00',
      status: 'OPEN',
      overdue: false,
    }
  })

  /* --- transakcje i propozycje --- */
  const transactions: BankTransaction[] = []
  const suggestions: MatchSuggestion[] = []
  let txSeq = 0
  let sgSeq = 0

  function makeTransaction(args: {
    invoice: Invoice
    cents: number
    title: string
    status: TransactionStatus
    uppercaseName?: boolean
  }): BankTransaction {
    const cp = must(cpById.get(args.invoice.counterpartyId), 'brak kontrahenta')
    const sign = args.invoice.type === 'SALES' ? 1 : -1
    const wanted = addDays(args.invoice.dueDate, int(rng, -3, 2))
    const bookingDate = [wanted, REFERENCE_DATE].sort()[0] ?? REFERENCE_DATE
    txSeq += 1
    const tx: BankTransaction = {
      id: `tx-${String(txSeq).padStart(3, '0')}`,
      bookingDate: bookingDate < args.invoice.issueDate ? args.invoice.issueDate : bookingDate,
      amount: fromCents(sign * args.cents),
      currency: args.invoice.currency,
      counterpartyName: args.uppercaseName ? cp.name.toUpperCase() : cp.name,
      iban: must(cp.ibans[0], 'brak rachunku'),
      title: args.title,
      status: args.status,
    }
    transactions.push(tx)
    return tx
  }

  function suggest(tx: BankTransaction, invoice: Invoice, confidence: number, rationale: string) {
    const open = toCents(invoice.grossAmount) - toCents(invoice.paidAmount)
    const diff = Math.abs(toCents(tx.amount)) - open
    sgSeq += 1
    suggestions.push({
      id: `sg-${String(sgSeq).padStart(3, '0')}`,
      transactionId: tx.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      counterpartyName: invoice.counterpartyName,
      invoiceOpenAmount: fromCents(open),
      currency: invoice.currency,
      amountDifference: fromCents(diff),
      confidence,
      rationale,
    })
  }

  const round2 = (x: number) => Math.round(x * 100) / 100
  const high = () => round2(0.95 + rng() * 0.04)

  /** Inna faktura tego samego kontrahenta i typu: słabsza propozycja obok właściwej. */
  function addDecoy(tx: BankTransaction, invoice: Invoice, pool: Invoice[]) {
    const other = pool.find(
      (i) => i.id !== invoice.id && i.counterpartyId === invoice.counterpartyId && i.type === invoice.type,
    )
    if (other) {
      suggest(tx, other, round2(0.18 + rng() * 0.15), 'Ten sam kontrahent, ale kwota i termin się nie zgadzają.')
    }
  }

  const shuffled = shuffle(rng, invoices)
  let cursor = 0
  const take = (n: number): Invoice[] => {
    const slice = shuffled.slice(cursor, cursor + n)
    cursor += n
    return slice
  }

  // Historia: już rozliczone (6 w całości, 2 częściowo)
  const history = take(8)
  history.forEach((inv, i) => {
    const full = i < 6
    const cents = full ? toCents(inv.grossAmount) : Math.round(toCents(inv.grossAmount) / 2)
    makeTransaction({ invoice: inv, cents, title: `Zapł. ${inv.number}`, status: 'MATCHED' })
    inv.paidAmount = fromCents(cents)
    inv.status = full ? 'PAID' : 'PARTIALLY_PAID'
  })

  const open = invoices.filter((i) => i.status === 'OPEN')

  // 1. Czyste przypadki: numer w tytule, kwota zgodna
  take(10).forEach((inv, i) => {
    const tx = makeTransaction({
      invoice: inv,
      cents: toCents(inv.grossAmount),
      title: i % 2 === 0 ? `Zapłata ${inv.number}` : `${inv.number} przelew`,
      status: 'UNMATCHED',
    })
    suggest(tx, inv, high(), 'Numer faktury w tytule przelewu, kwota i kontrahent się zgadzają.')
    if (i % 3 === 0) addDecoy(tx, inv, open)
  })

  // 2. Brak numeru faktury w tytule
  const vagueTitles = ['Za usługi wdrożeniowe', 'Płatność za abonament', 'Opłata zgodnie z umową', 'Przelew za usługi']
  take(6).forEach((inv) => {
    const tx = makeTransaction({
      invoice: inv,
      cents: toCents(inv.grossAmount),
      title: pick(rng, vagueTitles),
      status: 'UNMATCHED',
      uppercaseName: true,
    })
    suggest(tx, inv, round2(0.7 + rng() * 0.15), 'Brak numeru faktury w tytule. Kontrahent i kwota zgadzają się z tą otwartą fakturą.')
    addDecoy(tx, inv, open)
  })

  // 3. Numer z literówką lub bez ukośników
  take(4).forEach((inv) => {
    const tx = makeTransaction({
      invoice: inv,
      cents: toCents(inv.grossAmount),
      title: `FV ${inv.number.replaceAll('/', ' ')}`,
      status: 'UNMATCHED',
    })
    suggest(tx, inv, round2(0.8 + rng() * 0.1), 'Numer faktury zapisany bez ukośników, kontrahent i kwota się zgadzają.')
  })

  // 4. Wpłaty częściowe
  take(3).forEach((inv) => {
    const share = int(rng, 4, 7) / 10
    const tx = makeTransaction({
      invoice: inv,
      cents: Math.round(toCents(inv.grossAmount) * share),
      title: `Zaliczka ${inv.number}`,
      status: 'UNMATCHED',
    })
    suggest(
      tx,
      inv,
      round2(0.6 + rng() * 0.15),
      `Wpłata częściowa: ok. ${Math.round(share * 100)}% kwoty faktury. Numer w tytule się zgadza.`,
    )
  })

  // 5. Bez żadnej propozycji (np. zwrot, przelew własny)
  const anchors = take(2)
  const noMatchTitles = ['Zwrot nadpłaty', 'Przelew własny, rozliczenie kasy']
  anchors.forEach((inv, i) => {
    makeTransaction({
      invoice: inv,
      cents: int(rng, 12_000, 90_000),
      title: noMatchTitles[i] ?? 'Przelew',
      status: 'UNMATCHED',
      uppercaseName: true,
    })
  })

  for (const inv of invoices) {
    inv.overdue = inv.status !== 'PAID' && inv.dueDate < REFERENCE_DATE
  }

  transactions.sort((a, b) => b.bookingDate.localeCompare(a.bookingDate) || a.id.localeCompare(b.id))

  return { counterparties, services, invoices, transactions, suggestions }
}
