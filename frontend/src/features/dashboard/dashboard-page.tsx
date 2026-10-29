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
        <div className="border-y border-rule bg-sheet">
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        </div>
      ) : (
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
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
    <section>
      <div className="border-t-2 border-ink pt-3 pb-4">
        <h2 className="text-xl">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Skeleton() {
  return (
    <div aria-busy className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-6 rounded-control bg-rule-soft motion-safe:animate-pulse" />
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
        <div className="flex items-baseline justify-between gap-4 pt-3">
          <dt className="font-medium">Saldo</dt>
          <dd className="num double-rule pb-0.5 font-serif text-2xl">
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
    <ul className="space-y-5">
      <li className="flex flex-wrap items-center justify-between gap-3">
        <p>
          <span className="num font-serif text-2xl">{summary.unmatchedTransactions}</span>{' '}
          {summary.unmatchedTransactions === 1 ? 'transakcja czeka' : 'transakcji czeka'} na rozliczenie
        </p>
        <Link to="/rozliczenia" className={buttonVariants({ variant: 'primary' })}>
          Przejdź do rozliczeń
        </Link>
      </li>
      <li className="flex flex-wrap items-center justify-between gap-3">
        <p>
          <span className="num font-serif text-2xl">{summary.overdueInvoices}</span>{' '}
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
        <div role="img" aria-label={description} className="flex h-3 overflow-hidden rounded-control bg-rule-soft">
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
          <li key={bucket.label} className="flex items-baseline justify-between gap-3 border-b border-rule-soft pb-2">
            <span className="flex items-center gap-2">
              <span aria-hidden className={cn('size-2.5 shrink-0 rounded-[1px]', AGING_TONES[index])} />
              {bucket.label}
            </span>
            <span className="num font-medium">{bucket.count}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
