import { describe, expect, it } from 'vitest'
import { formatIban, formatMoney, formatPercent } from './format'

// Intl używa twardych spacji, w testach porównujemy zwykłe.
const plain = (value: string) => value.replace(/\s/g, ' ')

describe('formatMoney', () => {
  it('formatuje kwotę po polsku z kodem waluty', () => {
    expect(plain(formatMoney('12345.6', 'PLN'))).toBe('12 345,60 PLN')
  })

  it('zachowuje znak obciążenia', () => {
    expect(plain(formatMoney('-250.00', 'EUR'))).toBe('-250,00 EUR')
  })
})

describe('formatIban', () => {
  it('grupuje rachunek po cztery znaki', () => {
    expect(formatIban('PL61109010140000071219812874')).toBe('PL61 1090 1014 0000 0712 1981 2874')
  })
})

describe('formatPercent', () => {
  it('zaokrągla pewność do pełnych procentów', () => {
    expect(formatPercent(0.874)).toBe('87%')
  })
})
