# Frontend: Uzgodnienia

Interfejs do uzgadniania płatności bankowych z fakturami (mini-ERP, kontrahenci, usługi, faktury, transakcje, ekran rozliczeń).
Na razie dane pochodzą z mocków (MSW). Backend Spring Boot dojdzie później. Projekt edukacyjny, dane wyłącznie syntetyczne.

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS 4, React Router, TanStack Query, MSW, Vitest + Testing Library.
Biblioteki są w bardzo świeżych wersjach. Przy wątpliwościach sprawdzaj dokumentację i typy w `node_modules`, nie zakładaj
wzorców ze starszych wersji (dotyczy zwłaszcza React Router, MSW i Vitest).

## Komendy

- `npm run dev`: serwer deweloperski (mocki włączone)
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`

## Struktura

- `src/app`: router i providery
- `src/components/ui`: komponenty bazowe, `src/components/layout`: układ aplikacji
- `src/features/<nazwa>`: `api.ts` (fetchery), `hooks.ts` (React Query), `*-page.tsx`, testy obok kodu
- `src/lib`: klient API, formatowanie, `useListParams`
- `src/mocks`: mock backendu (`handlers.ts`, dane w `data/seed.ts`, pamięć w `db.ts`)
- `src/types/api.ts`: kontrakt API

## Zasady

- **Pieniądze:** frontend nigdy nie liczy kwot. Kwoty to ciągi dziesiętne z backendu ("1230.50"), wyświetlane przez `lib/format.ts`.
  Sumy, różnice, salda i flagi typu `overdue` liczy backend. Arytmetyka na groszach jest dozwolona tylko w `src/mocks`.
- Fetch wyłącznie przez `lib/api-client.ts` i funkcje w `features/*/api.ts`. Komponenty używają hooków.
- Stan list (strona, szukany tekst, filtry) trzymamy w URL (`useListParams`).
- `types/api.ts` jest źródłem prawdy, dopóki nie ma OpenAPI. Zmiana kontraktu to jednoczesna zmiana typów, mocków i testów.
- Każda nowa funkcja ma test. Przed zakończeniem pracy `typecheck`, `lint` i `test` muszą przechodzić.
- Nie dodawaj zależności bez pytania. Bez `any`, `as` tylko na granicy API.
- Tekst interfejsu po polsku, kod i nazwy po angielsku.
- Pracuj małymi krokami. Po każdym kroku podsumuj, co zmieniono.

## Design

Język "księga rachunkowa": chłodny papier, atrament, linie zamiast kart, kwoty w cyfrach tabularnych (`.num`).
Tokeny kolorów i fontów są w `src/index.css` (`@theme`). Jeden kolor akcji (`pen`), kolory statusu: zielony to rozliczone,
czerwony to wymaga uwagi, bursztyn to częściowo. Nie dodawaj gradientów, cieni ani zaokrąglonych kart.
Widoczny fokus i `prefers-reduced-motion` muszą działać.

## Weryfikacja UI

Zmiany wizualne sprawdzaj w uruchomionej aplikacji (np. Playwright), nie tylko kompilacją.

## Przejście na prawdziwy backend

Ustaw `VITE_USE_MOCKS=false` i odkomentuj proxy `/api` w `vite.config.ts`. Handlery w `src/mocks/handlers.ts`
są wykonywalną specyfikacją endpointów, które musi zaimplementować ERP.
