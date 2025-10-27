# web-cuu-ho (Frontend static + optional backend)

This repo contains a static frontend (`frontend/`) and an optional backend under `server/`.

Quick start - frontend (dev server):

```powershell
# from repo root
npm install
npm start
# open http://localhost:8080/frontend/index.html
```

Bundle JS with esbuild (optional):

```powershell
npm run build
# output: frontend/dist/bundle.js
```

Watch+build during development:

```powershell
npm run watch
```

Run backend (optional):

```powershell
cd server
npm install
# set environ vars, e.g.:
$env:MONGO_URI = "mongodb://localhost:27017/cuuho"
$env:JWT_SECRET = "your_secret"
npm run dev
```

Notes:
- Frontend will try to load `frontend/dist/bundle.js` (if present) for a single-file bundle. If not found it will fall back to unbundled scripts under `assets/js/`.
- To connect to backend make sure server is running and `MONGO_URI` points to a running MongoDB.

If you want, I can:
- Add spinner/disabled state while sending reports
- Add stricter frontend validation
- Make auth fallback (if token invalid, post as anonymous)
- Create a `make-admin` seed script for testing admin endpoints
