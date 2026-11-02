# Frontend: Reconciliation

An interface for reconciling bank payments with invoices (mini-ERP: counterparties, services, invoices, transactions, reconciliation screen).
Data comes from the Spring Boot backend (`../backend/netting`) where the contract already exists (so far: counterparties), and from mocks (MSW) where it does not yet. Educational project, data is entirely synthetic.

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS 4, React Router, TanStack Query, MSW, Vitest + Testing Library.
Libraries are on very recent versions. When in doubt, check the docs and types in `node_modules`, do not assume
patterns from older versions (especially React Router, MSW, and Vitest).

## Commands

- `npm run dev`: dev server (mocks enabled, `/api` proxied to the backend)
- `npm run api:gen`: generates `src/types/api.gen.ts` from `../contract/openapi.yaml` (after every contract change)
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`

## Structure

- `src/app`: router and providers
- `src/components/ui`: base components, `src/components/layout`: app layout
- `src/features/<name>`: `api.ts` (fetchers), `hooks.ts` (React Query), `*-page.tsx`, tests next to the code
- `src/lib`: API client, formatting, `useListParams`
- `src/mocks`: backend mock (`handlers.ts`, data in `data/seed.ts`, memory in `db.ts`)
- `src/types/api.gen.ts`: types generated from the contract (do not edit by hand, committed), `src/types/api.ts`: re-exports under stable names and types that do not have a contract yet

## Rules

- **Money:** the frontend never computes amounts. Amounts are decimal strings from the backend ("1230.50"), displayed through `lib/format.ts`.
  Totals, differences, balances, and flags such as `overdue` are computed by the backend. Arithmetic on cents is allowed only in `src/mocks`.
- Fetch only through `lib/api-client.ts` and the functions in `features/*/api.ts`. Components use hooks.
- List state (page, search text, filters) is kept in the URL (`useListParams`).
- The source of truth is `../contract/openapi.yaml` (shared with the backend). Contract change: edit the YAML, run `npm run api:gen`, fix typecheck, mocks, and tests. A new endpoint goes into the contract, not into `types/api.ts`.
- Every new feature has a test. Before finishing, `typecheck`, `lint`, and `test` must pass.
- Do not add dependencies without asking. No `any`; `as` only at the API boundary.
- UI text is in Polish; code and names are in English.
- Work in small steps. After each step, summarize what changed.

## Design

Style: "modern SaaS": soft cards (`.card`, radius `--radius-card`, subtle shadow), gradient accent (logo, balance, primary button),
glass (`.glass`) in the navigation, background with a subtle glow, amounts in tabular figures (`.num`). Light and dark themes follow the system setting:
color, shadow, and font tokens live in `src/index.css` (`@theme` and the override in `prefers-color-scheme: dark`); do not hard-code colors.
One action color (`pen`); status colors: green means reconciled, red means needs attention, amber means partial.
Gradients and shadows only through tokens and utility classes. Visible focus and `prefers-reduced-motion` must work.

## UI verification

Check visual changes in the running app (e.g. Playwright), not just by compiling.

## Switching to the real backend

The `/api` proxy in `vite.config.ts` points to the backend (`API_PROXY_TARGET`, default `http://localhost:8080`, in docker-compose `http://backend:8080`).
Browser MSW (`src/mocks/browser.ts`) skips endpoints that have a real implementation (`counterpartyHandlers` in `handlers.ts` are used only by tests).
Next endpoint: add it to the contract, implement it in the backend, move its handler to a separate list (like `counterpartyHandlers`), and disable it in `browser.ts`.
`VITE_USE_MOCKS=false` disables MSW completely (only once all endpoints are in the backend).
