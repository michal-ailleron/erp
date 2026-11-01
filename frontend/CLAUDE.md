# Frontend: Uzgodnienia

Interfejs do uzgadniania płatności bankowych z fakturami (mini-ERP, kontrahenci, usługi, faktury, transakcje, ekran rozliczeń).
Dane pochodzą z backendu Spring Boot (`../backend/netting`) tam, gdzie kontrakt już istnieje (na razie kontrahenci), a z mocków (MSW) tam, gdzie go jeszcze nie ma. Projekt edukacyjny, dane wyłącznie syntetyczne.

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS 4, React Router, TanStack Query, MSW, Vitest + Testing Library.
Biblioteki są w bardzo świeżych wersjach. Przy wątpliwościach sprawdzaj dokumentację i typy w `node_modules`, nie zakładaj
wzorców ze starszych wersji (dotyczy zwłaszcza React Router, MSW i Vitest).

## Komendy

- `npm run dev`: serwer deweloperski (mocki włączone, `/api` przez proxy do backendu)
- `npm run api:gen`: generuje `src/types/api.gen.ts` z `../contract/openapi.yaml` (po każdej zmianie kontraktu)
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`

## Struktura

- `src/app`: router i providery
- `src/components/ui`: komponenty bazowe, `src/components/layout`: układ aplikacji
- `src/features/<nazwa>`: `api.ts` (fetchery), `hooks.ts` (React Query), `*-page.tsx`, testy obok kodu
- `src/lib`: klient API, formatowanie, `useListParams`
- `src/mocks`: mock backendu (`handlers.ts`, dane w `data/seed.ts`, pamięć w `db.ts`)
- `src/types/api.gen.ts`: typy wygenerowane z kontraktu (nie edytuj ręcznie, commitowany), `src/types/api.ts`: re-eksporty pod stałymi nazwami i typy jeszcze bez kontraktu

## Zasady

- **Pieniądze:** frontend nigdy nie liczy kwot. Kwoty to ciągi dziesiętne z backendu ("1230.50"), wyświetlane przez `lib/format.ts`.
  Sumy, różnice, salda i flagi typu `overdue` liczy backend. Arytmetyka na groszach jest dozwolona tylko w `src/mocks`.
- Fetch wyłącznie przez `lib/api-client.ts` i funkcje w `features/*/api.ts`. Komponenty używają hooków.
- Stan list (strona, szukany tekst, filtry) trzymamy w URL (`useListParams`).
- Źródłem prawdy jest `../contract/openapi.yaml` (wspólny z backendem). Zmiana kontraktu: edytuj YAML, `npm run api:gen`, popraw typecheck, mocki i testy. Nowy endpoint dodajemy do kontraktu, nie do `types/api.ts`.
- Każda nowa funkcja ma test. Przed zakończeniem pracy `typecheck`, `lint` i `test` muszą przechodzić.
- Nie dodawaj zależności bez pytania. Bez `any`, `as` tylko na granicy API.
- Tekst interfejsu po polsku, kod i nazwy po angielsku.
- Pracuj małymi krokami. Po każdym kroku podsumuj, co zmieniono.

## Design

Język "nowoczesny SaaS": miękkie karty (`.card`, promień `--radius-card`, delikatny cień), gradientowy akcent (logo, saldo, przycisk główny),
szkło (`.glass`) w nawigacji, tło z subtelną poświatą, kwoty w cyfrach tabularnych (`.num`). Jasny i ciemny motyw wg ustawień systemu:
tokeny kolorów, cieni i fontów są w `src/index.css` (`@theme` i nadpisanie w `prefers-color-scheme: dark`), nie wpisuj kolorów na sztywno.
Jeden kolor akcji (`pen`), kolory statusu: zielony to rozliczone, czerwony to wymaga uwagi, bursztyn to częściowo.
Gradienty i cienie tylko przez tokeny i klasy pomocnicze. Widoczny fokus i `prefers-reduced-motion` muszą działać.

## Weryfikacja UI

Zmiany wizualne sprawdzaj w uruchomionej aplikacji (np. Playwright), nie tylko kompilacją.

## Przejście na prawdziwy backend

Proxy `/api` w `vite.config.ts` kieruje do backendu (`API_PROXY_TARGET`, domyślnie `http://localhost:8080`, w docker-compose `http://backend:8080`).
Przeglądarkowy MSW (`src/mocks/browser.ts`) pomija endpointy z prawdziwą implementacją (`counterpartyHandlers` w `handlers.ts` używają tylko testy).
Kolejny endpoint: dodaj go do kontraktu, zaimplementuj w backendzie, przenieś jego handler do osobnej listy (jak `counterpartyHandlers`) i wyłącz w `browser.ts`.
`VITE_USE_MOCKS=false` wyłącza MSW całkowicie (dopiero gdy wszystkie endpointy są w backendzie).
