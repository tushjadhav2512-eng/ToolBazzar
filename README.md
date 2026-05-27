# ToolBazaar

ToolBazaar is a Next.js utility-tools website with PDF, image, text, generator and calculator tools. Most tools run fully in the browser, including file conversion tools.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` for local development, then fill in your values.

```bash
cp .env.example .env.local
```

Required for admin, analytics and ad settings:

- `MONGO_URL`
- `DB_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- `CORS_ORIGINS`

Public tools still render if MongoDB is not configured. Analytics tracking and admin data require MongoDB.

## GitHub Deployment Notes

This app uses Next.js API routes, so it is best deployed from GitHub to a Next.js host such as Vercel, Netlify or Render. Plain GitHub Pages can only host static files and will not run the admin/API routes.

Recommended Vercel flow:

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Add the environment variables from `.env.example`.
4. Use the default build command: `npm run build`.
5. Use the default install command: `npm install`.

## PDF to Image

The PDF to Image tool uses PDF.js in the browser. During `npm install`, `scripts/copy-pdf-worker.js` copies the PDF.js worker into `public/pdf.worker.min.mjs` so production builds can load it reliably.

## Useful Commands

```bash
npm run build
npm run start
```
