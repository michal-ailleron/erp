import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { CounterpartiesPage } from '@/features/counterparties/counterparties-page'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { InvoicesPage } from '@/features/invoices/invoices-page'
import { ReconciliationPage } from '@/features/reconciliation/reconciliation-page'
import { ServicesPage } from '@/features/services/services-page'
import { TransactionsPage } from '@/features/transactions/transactions-page'
import { NotFoundPage } from './not-found-page'

/** Trasy osobno od routera, żeby testy mogły użyć ich z MemoryRouter. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'rozliczenia', element: <ReconciliationPage /> },
      { path: 'transakcje', element: <TransactionsPage /> },
      { path: 'faktury', element: <InvoicesPage /> },
      { path: 'kontrahenci', element: <CounterpartiesPage /> },
      { path: 'uslugi', element: <ServicesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
