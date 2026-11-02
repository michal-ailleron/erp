1) In WSL: run docker compose build completes, and npm ci runs without errors.
2) docker compose up,
3) then curl -I http://localhost:5173 returns 200.
4) Open the app in a Windows browser at http://localhost:5173.
5) Edit a file in frontend/src on the host, confirm the browser hot-reloads (HMR works through the bind mount).
6) docker compose run --rm frontend npm run test and npm run lint pass.
7) docker build --target prod -t erp-prod ./frontend, then run it on port 4173 and confirm the app loads.

## Production

Build and run the backend and production frontend together:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Open http://localhost:4173. The frontend is served by Caddy; `/api` requests are
proxied to the backend on port 8080. Stop the services with `Ctrl+C`; to run them
in the background, add `-d` and stop them later with:

```bash
docker compose -f docker-compose.prod.yml down
```
