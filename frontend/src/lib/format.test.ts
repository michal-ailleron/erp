import { describe, expect, it } from 'vitest'
import { formatIban, formatMoney, formatPercent } from './format'

// Intl uses non-breaking spaces; the tests compare regular spaces.
const plain = (value: string) => value.replace(/\s/g, ' ')

describe('formatMoney', () => {
  it('formats the amount in Polish style with the currency code', () => {
    expect(plain(formatMoney('12345.6', 'PLN'))).toBe('12 345,60 PLN')
  })

  it('keeps the sign of a debit', () => {
    expect(plain(formatMoney('-250.00', 'EUR'))).toBe('-250,00 EUR')
  })
})

describe('formatIban', () => {
  it('grupuje rachunek po cztery znaki', () => {
    expect(formatIban('PL61109010140000071219812874')).toBe('PL61 1090 1014 0000 0712 1981 2874')
  })
})

describe('formatPercent', () => {
  it('rounds confidence to whole percent', () => {
    expect(formatPercent(0.874)).toBe('87%')
  })
})
