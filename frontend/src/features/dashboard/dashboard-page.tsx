import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { ErrorState } from '@/components/ui/states'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DashboardSummary } from '@/types/api'
import { useDashboardSummary } from './hooks'

const AGING_TONES = ['bg-tick', 'bg-amber', 'bg-flag/60', 'bg-flag'] as const

export function DashboardPage() {
  const { data, isPending, error, refetch } = useDashboardSummary()

  return (
    <>
      <PageHeader title="Pulpit" description="Należności, zobowiązania i płatności, które czekają na rozliczenie." />

      {error ? (
        <div className="card">
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Pozycja finansowa">
            {isPending ? <Skeleton /> : <Position summary={data} />}
          </Section>

          <Section title="Do zrobienia">
            {isPending ? <Skeleton /> : <Todo summary={data} />}
          </Section>

          <div className="lg:col-span-2">
            <Section title="Faktury otwarte według terminu">
              {isPending ? <Skeleton /> : <Aging summary={data} />}
            </Section>
          </div>
        </div>
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card h-full p-6">
      <h2 className="pb-4 text-lg">{title}</h2>
      {children}
    </section>
  )
}

function Skeleton() {
  return (
    <div aria-busy className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-6 rounded-lg bg-rule-soft motion-safe:animate-pulse" />
      ))}
    </div>
  )
}

function Position({ summary }: { summary: DashboardSummary }) {
  return (
    <>
      <dl>
        <div className="flex items-baseline justify-between gap-4 border-b border-rule-soft py-2.5">
          <dt>
            Należności od odbiorców
            <span className="block text-xs text-ink-faint">otwarte faktury sprzedaży</span>
          </dt>
          <dd className="num">{formatMoney(summary.openSalesTotal, summary.currency)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-rule-soft py-2.5">
          <dt>
            Zobowiązania wobec dostawców
            <span className="block text-xs text-ink-faint">otwarte faktury kosztowe</span>
          </dt>
          <dd className="num">{formatMoney(summary.openCostTotal, summary.currency)}</dd>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4 rounded-control bg-pen-soft px-4 py-3">
          <dt className="font-medium">Saldo</dt>
          <dd className="num text-gradient font-display text-3xl font-semibold">
            {formatMoney(summary.netPosition, summary.currency)}
          </dd>
        </div>
      </dl>
      <p className="pt-3 text-xs text-ink-faint">Tylko faktury w PLN, po odjęciu dotychczasowych wpłat.</p>
    </>
  )
}

function Todo({ summary }: { summary: DashboardSummary }) {
  return (
    <ul className="space-y-4">
      <li className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-paper/70 px-4 py-3">
        <p>
          <span className="num font-display text-3xl font-semibold">{summary.unmatchedTransactions}</span>{' '}
          {summary.unmatchedTransactions === 1 ? 'transakcja czeka' : 'transakcji czeka'} na rozliczenie
        </p>
        <Link to="/rozliczenia" className={buttonVariants({ variant: 'primary' })}>
          Przejdź do rozliczeń
        </Link>
      </li>
      <li className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-paper/70 px-4 py-3">
        <p>
          <span className="num font-display text-3xl font-semibold text-flag">{summary.overdueInvoices}</span>{' '}
          {summary.overdueInvoices === 1 ? 'faktura jest' : 'faktur jest'} po terminie
        </p>
        <Link to="/faktury?status=OPEN" className={buttonVariants({ variant: 'secondary' })}>
          Zobacz otwarte faktury
        </Link>
      </li>
    </ul>
  )
}

function Aging({ summary }: { summary: DashboardSummary }) {
  const total = summary.aging.reduce((acc, bucket) => acc + bucket.count, 0)
  const description = summary.aging.map((bucket) => `${bucket.label}: ${bucket.count}`).join(', ')

  return (
    <>
      {total > 0 && (
        <div role="img" aria-label={description} className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-rule-soft">
          {summary.aging.map((bucket, index) => (
            <div
              key={bucket.label}
              className={cn(AGING_TONES[index])}
              style={{ width: `${(bucket.count / total) * 100}%` }}
            />
          ))}
        </div>
      )}
      <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {summary.aging.map((bucket, index) => (
          <li key={bucket.label} className="flex items-baseline justify-between gap-3 rounded-control bg-paper/70 px-3 py-2">
            <span className="flex items-center gap-2">
              <span aria-hidden className={cn('size-2.5 shrink-0 rounded-full', AGING_TONES[index])} />
              {bucket.label}
            </span>
            <span className="num font-medium">{bucket.count}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
