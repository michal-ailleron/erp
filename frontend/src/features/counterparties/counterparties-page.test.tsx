import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { getDb } from '@/mocks/db'
import { renderPage } from '@/test/utils'
import { CounterpartiesPage } from './counterparties-page'

describe('CounterpartiesPage', () => {
  it('pokazuje kontrahentów z API', async () => {
    renderPage(<CounterpartiesPage />)
    const [first] = getDb().counterparties
    if (!first) throw new Error('brak danych testowych')

    expect(await screen.findByText(first.name)).toBeInTheDocument()
  })

  it('filtruje listę po wpisaniu tekstu', async () => {
    const user = userEvent.setup()
    renderPage(<CounterpartiesPage />)
    await screen.findByText('Nordwind Logistyka Sp. z o.o.')

    await user.type(screen.getByRole('searchbox', { name: 'Szukaj kontrahenta' }), 'Browar')

    await waitFor(() => expect(screen.queryByText('Nordwind Logistyka Sp. z o.o.')).not.toBeInTheDocument())
    expect(screen.getByText('Browar Dolina Sp. k.')).toBeInTheDocument()
  })

  it('pokazuje stan pusty, gdy nic nie pasuje', async () => {
    const user = userEvent.setup()
    renderPage(<CounterpartiesPage />)

    await user.type(await screen.findByRole('searchbox'), 'zzzzzz')

    expect(await screen.findByText('Nie znaleziono kontrahentów')).toBeInTheDocument()
  })
})
