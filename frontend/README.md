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
