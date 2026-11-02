/**
 * Formatting for DISPLAY only.
 *
 * Project rule: the frontend never computes money. Amounts arrive from
 * the backend as decimal strings ("1230.50") and go back the same way. Number() below
 * is used only to format the string, not for arithmetic.
 */
import type { Currency } from '@/types/api'

export function formatMoney(amount: string, currency: Currency): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  }).format(Number(amount))
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}

/** 0.87 -> "87%" */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

/** PL12345678901234567890123456 -> "PL12 3456 7890 1234 5678 9012 3456" */
export function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim()
}
