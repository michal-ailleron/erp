---
name: new-list-screen
description: Adds a new list screen (table with search, filters, and pagination) to this project. Use when a new entity or list needs to be added.
---

# New list screen

Reference patterns: `src/features/counterparties` (simple) and `src/features/invoices` (with filters).

## Steps

1. **Contract type:** add the interface to `src/types/api.ts`. Amounts as `string`. Computed values (totals, flags) are provided by the backend.
2. **Mock:** add data to `src/mocks/data/seed.ts` and a `GET /api/<resource>` endpoint to `src/mocks/handlers.ts`
   (use `paginate` and `matchesText`).
3. **Fetcher:** `src/features/<name>/api.ts` with a function based on `apiGet` and a query type.
4. **Hook:** `src/features/<name>/hooks.ts` with `useQuery` and `placeholderData: keepPreviousData`.
5. **Page:** `src/features/<name>/<name>-page.tsx`
   - list state via `useListParams`, filter values passed through `parseOneOf`,
   - columns as `Column<T>[]` in `DataTable`, amounts with `align: 'right'` and `formatMoney`,
   - `PageHeader`, `SearchInput`, optionally `SegmentedControl` / `SelectField`, `Pagination`,
   - empty and error state messages in Polish, telling the user what to do next.
6. **Route and menu:** an entry in `src/app/router.tsx` and in `NAV_ITEMS` in `src/components/layout/app-shell.tsx`.
7. **Test:** `<name>-page.test.tsx` next to the page (list loads, search filters, empty state). Pattern: `counterparties-page.test.tsx`.
8. **Verification:** `npm run typecheck && npm run lint && npm test`.

## What not to do

- Don't compute amounts in the frontend.
- Don't call `fetch` in components.
- Don't add libraries for tables or forms without agreement.
