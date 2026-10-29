import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { getDb } from '@/mocks/db'
import { renderPage } from '@/test/utils'
import { ReconciliationPage } from './reconciliation-page'

const unmatchedCount = () => getDb().transactions.filter((t) => t.status === 'UNMATCHED').length

describe('ReconciliationPage', () => {
  it('zatwierdza propozycję: transakcja znika z kolejki, a faktura zmienia status', async () => {
    const user = userEvent.setup()
    renderPage(<ReconciliationPage />)

    const before = (await screen.findAllByRole('option')).length
    expect(before).toBe(unmatchedCount())

    const [approve] = await screen.findAllByRole('button', { name: 'Zatwierdź' })
    if (!approve) throw new Error('brak propozycji do zatwierdzenia')
    await user.click(approve)

    expect(await screen.findByText(/Rozliczono/)).toBeInTheDocument()
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(before - 1))
    expect(unmatchedCount()).toBe(before - 1)
    expect(getDb().invoices.some((i) => i.status === 'PAID' || i.status === 'PARTIALLY_PAID')).toBe(true)
  })

  it('odrzucona propozycja znika z listy', async () => {
    const user = userEvent.setup()
    renderPage(<ReconciliationPage />)

    const rejectButtons = await screen.findAllByRole('button', { name: 'Odrzuć' })
    const before = rejectButtons.length
    const [first] = rejectButtons
    if (!first) throw new Error('brak propozycji do odrzucenia')
    await user.click(first)

    await waitFor(() => expect(screen.queryAllByRole('button', { name: 'Odrzuć' }).length).toBeLessThan(before))
  })

  it('wyjaśnia, co zrobić, gdy transakcja nie ma propozycji', async () => {
    const user = userEvent.setup()
    renderPage(<ReconciliationPage />)

    const [target] = await screen.findAllByText('Zwrot nadpłaty')
    if (!target) throw new Error('brak transakcji bez propozycji')
    await user.click(target)

    expect(await screen.findByText('Brak propozycji dla tej transakcji')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Otwórz listę faktur' })).toBeInTheDocument()
  })

  it('Enter na liście zatwierdza pierwszą propozycję', async () => {
    const user = userEvent.setup()
    renderPage(<ReconciliationPage />)

    const list = await screen.findByRole('listbox', { name: 'Nierozliczone transakcje' })
    await screen.findAllByRole('button', { name: 'Zatwierdź' })
    const before = unmatchedCount()

    list.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => expect(unmatchedCount()).toBe(before - 1))
  })
})
