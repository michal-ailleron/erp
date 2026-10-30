In WSL: docker compose build completes, and npm ci runs without errors.
docker compose up, then curl -I http://localhost:5173 returns 200. Open the app in a Windows browser at http://localhost:5173.
Edit a file in frontend/src on the host, confirm the browser hot-reloads (HMR works through the bind mount).
docker compose run --rm frontend npm run test and npm run lint pass.
docker build --target prod -t erp-prod ./frontend, then run it on port 4173 and confirm the app loads.