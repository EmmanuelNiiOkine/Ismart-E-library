# ISMART E-Library

Internal legal document library for iSmart International Ghana Limited.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo credentials

| Role     | Email                      | Password      |
|----------|----------------------------|---------------|
| Admin    | admin@ismartghana.com      | admin123      |
| Employee | employee@ismartghana.com   | employee123   |

## Project layout

```
src/              React app source
public/           Static assets (logo, favicon)
scripts/          Ghana Acts download tooling
downloaded-books/ Local PDF storage (when populated)
pics/             Brand assets
```

## Deploy

```bash
npm run build
npx vercel deploy --prod
```

## Notes

This is a **frontend-only** build with mock data. Connect to the Laravel API backend for production use.
