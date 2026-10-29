---
name: new-list-screen
description: Dodaje nowy ekran z listą (tabela z wyszukiwaniem, filtrami i stronicowaniem) w tym projekcie. Użyj, gdy trzeba dodać nową encję lub listę.
---

# Nowy ekran listowy

Wzorzec referencyjny: `src/features/counterparties` (prosty) i `src/features/invoices` (z filtrami).

## Kroki

1. **Typ w kontrakcie:** dodaj interfejs do `src/types/api.ts`. Kwoty jako `string`. Wartości wyliczane (sumy, flagi) dostarcza backend.
2. **Mock:** dodaj dane do `src/mocks/data/seed.ts` i endpoint `GET /api/<zasób>` do `src/mocks/handlers.ts`
   (użyj `paginate` i `matchesText`).
3. **Fetcher:** `src/features/<nazwa>/api.ts` z funkcją opartą na `apiGet` i typem zapytania.
4. **Hook:** `src/features/<nazwa>/hooks.ts` z `useQuery` i `placeholderData: keepPreviousData`.
5. **Strona:** `src/features/<nazwa>/<nazwa>-page.tsx`
   - stan listy przez `useListParams`, wartości filtrów przepuszczone przez `parseOneOf`,
   - kolumny jako `Column<T>[]` w `DataTable`, kwoty z `align: 'right'` i `formatMoney`,
   - `PageHeader`, `SearchInput`, opcjonalnie `SegmentedControl` / `SelectField`, `Pagination`,
   - komunikaty stanu pustego i błędu po polsku, mówiące, co zrobić dalej.
6. **Trasa i menu:** wpis w `src/app/router.tsx` i w `NAV_ITEMS` w `src/components/layout/app-shell.tsx`.
7. **Test:** `<nazwa>-page.test.tsx` obok strony (lista się wczytuje, wyszukiwanie filtruje, stan pusty). Wzór: `counterparties-page.test.tsx`.
8. **Weryfikacja:** `npm run typecheck && npm run lint && npm test`.

## Czego nie robić

- Nie liczyć kwot we froncie.
- Nie wywoływać `fetch` w komponentach.
- Nie dodawać bibliotek do tabel ani formularzy bez uzgodnienia.
