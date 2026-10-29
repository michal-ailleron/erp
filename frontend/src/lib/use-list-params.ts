import { useSearchParams } from 'react-router'

/**
 * Stan listy (strona, szukany tekst, filtry) trzymany w adresie URL.
 * Dzięki temu odświeżenie strony i link do widoku zachowują filtry,
 * a przycisk "wstecz" działa tak, jak użytkownik się spodziewa.
 */
export function useListParams<F extends string>(filterKeys: readonly F[]) {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const q = searchParams.get('q') ?? ''
  const filters = Object.fromEntries(filterKeys.map((key) => [key, searchParams.get(key) ?? ''])) as Record<F, string>

  function update(changes: Record<string, string | number | undefined>) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        for (const [key, value] of Object.entries(changes)) {
          if (value === undefined || value === '') next.delete(key)
          else next.set(key, String(value))
        }
        // Każda zmiana filtra wraca na pierwszą stronę (chyba że zmieniamy samą stronę).
        if (!('page' in changes)) next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  return {
    page,
    q,
    filters,
    setPage: (value: number) => update({ page: value }),
    setQuery: (value: string) => update({ q: value }),
    setFilter: (key: F, value: string) => update({ [key]: value }),
  }
}
