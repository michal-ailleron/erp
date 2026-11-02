
## Backend (Spring Boot) and OpenAPI Contract
- Contract: contract/openapi.yaml (the single source of truth for both applications).
- docker compose up --build starts the backend (http://localhost:8080) and frontend (http://localhost:5173). Vite forwards /api requests to the backend.
- Test: curl 'http://localhost:8080/api/counterparties?kind=CUSTOMER&q=gdansk&page=1&pageSize=5'.
- After changing the contract: the backend generates interfaces during the build (openapi-generator-maven-plugin). Refresh the frontend types by running npm run api:gen in frontend/ (or docker compose exec frontend npm run api:gen), then commit src/types/api.gen.ts.
- Backend tests (MockMvc) run during docker compose build backend. The runtime image contains only the JRE, so there is no separate mvnw test command available inside the container.