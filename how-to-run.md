In WSL: docker compose build completes, and npm ci runs without errors.
docker compose up, then curl -I http://localhost:5173 returns 200. Open the app in a Windows browser at http://localhost:5173.
Edit a file in frontend/src on the host, confirm the browser hot-reloads (HMR works through the bind mount).
docker compose run --rm frontend npm run test and npm run lint pass.
docker build --target prod -t erp-prod ./frontend, then run it on port 4173 and confirm the app loads.

## Backend (Spring Boot) i kontrakt OpenAPI

- Kontrakt: `contract/openapi.yaml` (jedno źródło prawdy dla obu aplikacji).
- `docker compose up --build` uruchamia backend (http://localhost:8080) i frontend (http://localhost:5173). Vite przekazuje `/api` do backendu.
- Test: `curl 'http://localhost:8080/api/counterparties?kind=CUSTOMER&q=gdansk&page=1&pageSize=5'`.
- Po zmianie kontraktu: backend generuje interfejsy przy budowaniu (`openapi-generator-maven-plugin`), a typy frontendu odświeżasz `npm run api:gen` w `frontend/` (lub `docker compose exec frontend npm run api:gen`) i commitujesz `src/types/api.gen.ts`.
- Testy backendu (MockMvc) uruchamiają się podczas `docker compose build backend`; obraz uruchomieniowy ma tylko JRE, więc osobnego polecenia `mvnw test` w kontenerze nie ma.
