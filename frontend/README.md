
# Reconciliation (Frontend)

An interface for reconciling bank payments with invoices: contractors, services, invoices, transactions, and a reconciliation screen where an accountant approves or rejects matching suggestions.

The data is synthetic and comes from mocks (MSW), so the application runs without a backend.

## Getting Started

Node.js 22 or newer is required.

```bash
npm install
npm run dev
```
Additional commands: npm test, npm run lint, npm run typecheck, npm run build.
## What's Included
- Dashboard with the financial position and invoice aging structure.
- Lists: contractors, services, invoices (sales and expenses), bank transactions. Search, filters, and pagination are reflected in the URL.
- Reconciliation: a queue of unreconciled bank transfers, suggestions with confidence indicators, approval and rejection, keyboard support
  (arrow keys switch between transactions, Enter approves the first suggestion).
## Mocks and Backend
Handlers in src/mocks/handlers.ts describe the endpoints that the ERP system should provide. The contract is defined in src/types/api.ts.
Switching to a real backend: set VITE_USE_MOCKS=false and configure the /api proxy in vite.config.ts.
## Working with Claude Code
Project guidelines are defined in CLAUDE.md. The pattern for adding a new screen is described in the .claude/skills/new-list-screen skill.

# Polish version
# Uzgodnienia (frontend)

Interfejs do uzgadniania płatności bankowych z fakturami: kontrahenci, usługi, faktury, transakcje i ekran rozliczeń,
na którym księgowy zatwierdza lub odrzuca propozycje dopasowania.

Dane są syntetyczne i pochodzą z mocków (MSW), więc aplikacja działa bez backendu.

## Uruchomienie

Wymagany Node.js 22 lub nowszy.

```bash
npm install
npm run dev
```

Pozostałe komendy: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

## Co jest w środku

- Pulpit z pozycją finansową i strukturą wiekową faktur.
- Listy: kontrahenci, usługi, faktury (sprzedaż i koszty), transakcje bankowe. Wyszukiwanie, filtry i strona są w adresie URL.
- Rozliczenia: kolejka nierozliczonych przelewów, propozycje z miarką pewności, zatwierdzanie i odrzucanie, obsługa klawiaturą
  (strzałki zmieniają transakcję, Enter zatwierdza pierwszą propozycję).

## Mocki i backend

Handlery w `src/mocks/handlers.ts` opisują endpointy, które ma udostępniać ERP. Kontrakt jest w `src/types/api.ts`.
Przejście na prawdziwy backend: `VITE_USE_MOCKS=false` i proxy `/api` w `vite.config.ts`.

## Praca z Claude Code

Zasady projektu są w `CLAUDE.md`. Wzorzec dodawania nowego ekranu jest opisany w skillu `.claude/skills/new-list-screen`.
