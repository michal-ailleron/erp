import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTable, type Column } from './data-table'

interface Row {
  id: string
  name: string
}

const columns: readonly Column<Row>[] = [{ key: 'name', header: 'Nazwa', cell: (row) => row.name }]

const baseProps = {
  caption: 'Testowa tabela',
  columns,
  getRowKey: (row: Row) => row.id,
  emptyTitle: 'Pusto',
}

describe('DataTable', () => {
  it('renders rows', () => {
    render(<DataTable {...baseProps} isLoading={false} rows={[{ id: '1', name: 'Alfa' }]} />)
    expect(screen.getByRole('table', { name: 'Testowa tabela' })).toBeInTheDocument()
    expect(screen.getByText('Alfa')).toBeInTheDocument()
  })

  it('shows the empty state with a hint', () => {
    render(<DataTable {...baseProps} isLoading={false} rows={[]} emptyHint="Zmień filtry." />)
    expect(screen.getByText('Pusto')).toBeInTheDocument()
    expect(screen.getByText('Zmień filtry.')).toBeInTheDocument()
  })

  it('shows an error with a retry option', () => {
    render(<DataTable {...baseProps} isLoading={false} rows={undefined} errorMessage="Serwer nie odpowiada." onRetry={() => {}} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Serwer nie odpowiada.')
    expect(screen.getByRole('button', { name: 'Spróbuj ponownie' })).toBeInTheDocument()
  })

  it('marks loading as busy', () => {
    render(<DataTable {...baseProps} isLoading rows={undefined} />)
    expect(document.querySelector('tbody')).toHaveAttribute('aria-busy', 'true')
  })
})
