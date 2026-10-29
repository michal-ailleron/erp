import { useEffect, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { PageHeader } from '@/components/ui/page-header'
import { TickIcon } from '@/components/ui/tick-icon'
import { useTransactions } from '@/features/transactions/hooks'
import { formatDate, formatIban, formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BankTransaction, Currency, MatchSuggestion, SettlementResult } from '@/types/api'
import { ConfidenceRuler } from './confidence-ruler'
import { useApproveSuggestion, useRejectSuggestion, useSuggestions } from './hooks'

type LastResult = SettlementResult & { currency: Currency }

const optionId = (transactionId: string) => `tx-option-${transactionId}`

export function ReconciliationPage() {
  const transactions = useTransactions({ page: 1, q: '', status: 'UNMATCHED', pageSize: 50 })
  const items = transactions.data?.items ?? []

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<LastResult | null>(null)

  const selected = items.find((t) => t.id === selectedId) ?? items[0]
  const suggestions = useSuggestions(selected?.id)
  const approve = useApproveSuggestion()
  const reject = useRejectSuggestion()

  // Wybrana pozycja zawsze jest widoczna na liście, także przy nawigacji strzałkami.
  useEffect(() => {
    if (selected) document.getElementById(optionId(selected.id))?.scrollIntoView?.({ block: 'nearest' })
  }, [selected])

  function handleApprove(suggestion: MatchSuggestion) {
    const index = items.findIndex((t) => t.id === suggestion.transactionId)
    const next = items[index + 1] ?? items[index - 1]
    approve.mutate(
      { transactionId: suggestion.transactionId, invoiceId: suggestion.invoiceId },
      {
        onSuccess: (result) => {
          setLastResult({ ...result, currency: suggestion.currency })
          setSelectedId(next?.id ?? null)
        },
      },
    )
  }

  function moveSelection(delta: number) {
    const index = items.findIndex((t) => t.id === selected?.id)
    const target = items[index + delta]
    if (target) setSelectedId(target.id)
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveSelection(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveSelection(-1)
    } else if (event.key === 'Enter') {
      const top = suggestions.data?.[0]
      if (top && !approve.isPending) {
        event.preventDefault()
        handleApprove(top)
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Rozliczenia"
        description="Dopasuj przelewy z wyciągu do faktur. Wybierz transakcję, sprawdź propozycje i zatwierdź właściwą."
      />

      {transactions.error ? (
        <div className="border-y border-rule bg-sheet">
          <ErrorState message={transactions.error.message} onRetry={() => void transactions.refetch()} />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
          {/* Lewa kolumna: kolejka transakcji */}
          <section aria-labelledby="queue-heading">
            <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
              <h2 id="queue-heading" className="text-xl">
                Nierozliczone transakcje
              </h2>
              {transactions.data && <span className="num text-sm text-ink-soft">{transactions.data.total}</span>}
            </div>
            <p className="pt-1 pb-3 text-xs text-ink-faint">
              Strzałki w górę i w dół zmieniają transakcję, Enter zatwierdza pierwszą propozycję.
            </p>

            {transactions.isPending ? (
              <div className="space-y-2" aria-busy>
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-14 rounded-control bg-rule-soft motion-safe:animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="border-y border-rule bg-sheet">
                <EmptyState
                  title="Wszystkie transakcje są rozliczone"
                  hint="Nowe przelewy pojawią się tutaj po zaimportowaniu wyciągu."
                />
              </div>
            ) : (
              <div
                role="listbox"
                tabIndex={0}
                aria-label="Nierozliczone transakcje"
                aria-activedescendant={selected ? optionId(selected.id) : undefined}
                onKeyDown={handleListKeyDown}
                className="max-h-[28rem] overflow-y-auto border-y border-rule bg-sheet lg:max-h-[calc(100dvh-17rem)]"
              >
                {items.map((transaction) => (
                  <TransactionOption
                    key={transaction.id}
                    transaction={transaction}
                    selected={transaction.id === selected?.id}
                    onSelect={() => setSelectedId(transaction.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Prawa kolumna: wybrana transakcja i propozycje */}
          <section aria-labelledby="proposals-heading" className="min-w-0">
            <div className="border-t-2 border-ink pt-3">
              <h2 id="proposals-heading" className="text-xl">
                Propozycje dopasowania
              </h2>
            </div>

            <div aria-live="polite" className="pt-3">
              {lastResult && (
                <p key={lastResult.id} className="flex items-center gap-2 text-sm text-tick">
                  <TickIcon animate className="size-6 shrink-0" />
                  <span>
                    <strong className="font-medium">Rozliczono {lastResult.invoiceNumber}.</strong> Pokryto{' '}
                    <span className="num">{formatMoney(lastResult.appliedAmount, lastResult.currency)}</span>.
                  </span>
                </p>
              )}
            </div>

            {approve.error && (
              <p role="alert" className="pt-3 text-sm text-flag">
                {approve.error.message}
              </p>
            )}

            {selected ? (
              <>
                <StatementSlip transaction={selected} />
                <SuggestionList
                  isPending={suggestions.isPending}
                  errorMessage={suggestions.error?.message}
                  suggestions={suggestions.data}
                  busy={approve.isPending || reject.isPending}
                  onApprove={handleApprove}
                  onReject={(suggestion) => reject.mutate(suggestion.id)}
                />
              </>
            ) : (
              !transactions.isPending && (
                <p className="pt-6 text-ink-soft">Nie ma nic do rozliczenia.</p>
              )
            )}
          </section>
        </div>
      )}
    </>
  )
}

function TransactionOption({
  transaction,
  selected,
  onSelect,
}: {
  transaction: BankTransaction
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      id={optionId(transaction.id)}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'cursor-pointer border-b border-l-2 border-b-rule-soft px-3 py-2.5 last:border-b-0',
        selected ? 'border-l-pen bg-pen-soft' : 'border-l-transparent hover:bg-paper',
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-medium">{transaction.counterpartyName}</span>
        <span className="num shrink-0 text-sm font-medium">{formatMoney(transaction.amount, transaction.currency)}</span>
      </div>
      <div className="flex items-baseline justify-between gap-3 text-xs text-ink-soft">
        <span className="truncate">{transaction.title}</span>
        <span className="num shrink-0">{formatDate(transaction.bookingDate)}</span>
      </div>
    </div>
  )
}

/** Pozycja z wyciągu bankowego, do której szukamy faktury. */
function StatementSlip({ transaction }: { transaction: BankTransaction }) {
  return (
    <div className="mt-4 border border-rule bg-sheet px-4 py-4">
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink-faint">Kontrahent</dt>
          <dd className="font-medium">{transaction.counterpartyName}</dd>
        </div>
        <div className="sm:text-right">
          <dt className="text-xs text-ink-faint">Kwota</dt>
          <dd className="num font-serif text-2xl">{formatMoney(transaction.amount, transaction.currency)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-ink-faint">Tytuł przelewu</dt>
          <dd>{transaction.title}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-faint">Rachunek</dt>
          <dd className="num text-sm">{formatIban(transaction.iban)}</dd>
        </div>
        <div className="sm:text-right">
          <dt className="text-xs text-ink-faint">Data księgowania</dt>
          <dd className="num text-sm">{formatDate(transaction.bookingDate)}</dd>
        </div>
      </dl>
    </div>
  )
}

function SuggestionList({
  isPending,
  errorMessage,
  suggestions,
  busy,
  onApprove,
  onReject,
}: {
  isPending: boolean
  errorMessage?: string
  suggestions: MatchSuggestion[] | undefined
  busy: boolean
  onApprove: (suggestion: MatchSuggestion) => void
  onReject: (suggestion: MatchSuggestion) => void
}) {
  if (errorMessage) return <ErrorState message={errorMessage} />

  if (isPending) {
    return (
      <div className="mt-4 space-y-2" aria-busy>
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="h-24 bg-rule-soft motion-safe:animate-pulse" />
        ))}
      </div>
    )
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="mt-4 border-y border-rule bg-sheet">
        <EmptyState
          title="Brak propozycji dla tej transakcji"
          hint="Nie znaleziono pasującej faktury. Sprawdź listę faktur kontrahenta i wróć do tej transakcji."
          action={
            <Link to="/faktury?status=OPEN" className="text-sm text-pen underline underline-offset-2">
              Otwórz listę faktur
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <ul className="mt-4 border-y border-rule bg-sheet">
      {suggestions.map((suggestion) => (
        <li key={suggestion.id} className="border-b border-rule-soft px-4 py-4 last:border-b-0">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0 space-y-1">
              <p className="num font-medium">{suggestion.invoiceNumber}</p>
              <p className="text-sm text-ink-soft">{suggestion.counterpartyName}</p>
              <p className="num text-sm">
                Do zapłaty {formatMoney(suggestion.invoiceOpenAmount, suggestion.currency)}
                <span className="text-ink-soft">
                  {' · '}
                  {suggestion.amountDifference === '0.00'
                    ? 'kwota zgodna'
                    : `różnica ${formatMoney(suggestion.amountDifference, suggestion.currency)}`}
                </span>
              </p>
            </div>
            <ConfidenceRuler value={suggestion.confidence} />
          </div>

          <p className="mt-2 max-w-prose text-sm text-ink-soft">{suggestion.rationale}</p>

          <div className="mt-3 flex gap-2">
            <Button variant="primary" size="sm" disabled={busy} onClick={() => onApprove(suggestion)}>
              Zatwierdź
            </Button>
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => onReject(suggestion)}>
              Odrzuć
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
