# Offline Demo Kit — Anatomy Museum (GMERS Medical College, Godhra)

Date: 2026-08-14

## Purpose

The Anatomy Museum site is deployed at www.godhmedanatomy.vercel.app and is normally
presented online. The college where the presentation happens has **no stable internet**,
so we need a self-contained offline build that runs on a laptop and demonstrates the
**full application** (admin sign-in, catalogue, specimen pages, QR labels, add/edit
specimens) with **no network access**.

## Goals / Success Criteria

1. Runs entirely offline on the presenter's own laptop (`localhost:3000`).
2. Full app functionality works, including admin sign-in
   (`admin@anatomy.edu.in` / `password123`).
3. A single command starts everything; a separate one-time "prepare" step
   (run at home, with internet) produces the portable kit.
4. Demo data (admin user + Heart specimen + site settings) is seeded
   automatically so the catalogue is populated for the presentation.
5. Specimen images (the presenter's own heart photos) are bundled locally so
   cards look real offline.
6. The live Vercel deployment path is **not** changed: production behavior stays
   identical (PostgreSQL + Vercel Blob). All offline behavior is gated behind a
   `DEMO_MODE=1` environment flag.

## Approach

Use a `DEMO_MODE=1` switch. When on:

- **Database**: `better-sqlite3` SQLite file at `data/demo.sqlite`, wired through
  drizzle (`drizzle-orm/better-sqlite3`) and better-auth (which natively accepts a
  `Database` instance and auto-creates its auth tables).
- **Image uploads**: `/api/upload` and `/api/upload-image` write files to
  `public/uploads/` and return `/api/image?pathname=<name>` URLs (a runtime API
  route, because `next start` only serves `public/` files that existed at build
  time); `/api/image` serves from the local filesystem. Production path (Vercel
  Blob) is untouched.
- **Seed**: a demo-only `/api/demo/seed` route creates the admin user, site settings,
  and demo specimens (with local diagram images).
- **Fonts**: `next/font/google` is self-hosted at build time, so it already works
  offline after `next build`.
- **AI generator** (`/api/generate-specimen`): not wired to any UI component
  (verified), left untouched.

## Files Changed / Added

| File | Change |
|------|--------|
| `lib/db/schema-demo.ts` | New: SQLite (drizzle `sqlite-core`) versions of `specimens` + `site_settings`, exporting the same type names (`Specimen`, `NewSpecimen`, `SiteSettings`). |
| `lib/db/tables.ts` | New: exports `specimens` / `siteSettings` table objects from the active schema (demo = sqlite, prod = pg). |
| `lib/db/index.ts` | If `DEMO_MODE=1`, build drizzle over `better-sqlite3`; else keep existing `pg` Pool. |
| `lib/auth.ts` | In demo mode pass `new Database('data/demo.sqlite')` to better-auth; otherwise keep `pool`. |
| `app/actions/specimens.ts` | Import `specimens` from `@/lib/db/tables` instead of `@/lib/db/schema`. |
| `app/actions/settings.ts` | Import `siteSettings` from `@/lib/db/tables` instead of `@/lib/db/schema`. |
| `app/api/upload/route.ts` | Demo mode: save file under `public/uploads/`. |
| `app/api/upload-image/route.ts` | Demo mode: save file under `public/uploads/`. |
| `app/api/image/route.ts` | Demo mode: serve from local `public/uploads/`. |
| `app/api/demo/seed/route.ts` | New: demo-only seed endpoint (better-auth migrations + app tables + data). |
| `lib/demo-data.ts` | New: Heart specimen + admin credentials + site settings. |
| `lib/organ-content.ts` | New: 10-organ quick-fill library + `findOrganContent()` matcher. |
| `components/specimen-form.tsx` | New: "Quick-fill" button shown when the typed organ matches the library. |
| `lib/demo-mode.ts` | New: shared `isDemoMode()` helper reading `DEMO_MODE`. |
| `scripts/demo.mjs` | New: one-command runner (prepare if needed, seed, `next start`, open browser). |
| `package.json` | Add `demo`, `demo:prepare` scripts + `better-sqlite3` dependency. |
| `public/demo-images/*` | Presenter-provided heart photos (`heart-photo.jpg`, `heart-diagram.jpg`). |

## Demo Data (seeded)

- **Admin**: `admin@anatomy.edu.in` / `password123`.
- **Specimen**: Human Heart (`ANT-CVS-001`) with the presenter's own specimen
  photo and labeled diagram, MBBS-level description, functions, and clinical
  relevance.
- **Quick-fill**: typing an organ name (e.g. "Heart") in the Add Specimen form
  reveals a button that pre-fills content from a 10-organ library.

## Runtime Flow

1. **At home (once)**: `npm run demo:prepare` → `npm install`, `next build`
   (builds self-hosted fonts; needs internet).
2. **At college**: `npm run demo` → ensures seed ran, starts `next start`
   (`localhost:3000`), opens the browser. No internet required.

## Trade-offs / Notes

- QR codes encode `http://localhost:3000/...` — only scannable on the same machine,
  not a phone. For the presentation, the "scan" step is simulated by clicking the
  link. Acceptable for a demo; label printing still works.
- `better-sqlite3` is a native module; one-time `npm install` at home fetches
  prebuilt binaries (no compiler needed on Windows/Mac).
- The presenter must carry the project folder (with `node_modules`, `.next`, and
  `data/demo.sqlite`) on the laptop.
- `BETTER_AUTH_SECRET` is given a fixed demo-only fallback so better-auth works in
  `next start` (production mode) without real secrets.
- Demo-mode better-auth uses the same relaxed origin/CSRF settings as development
  (cross-site cookies, no CSRF check) so login works from any localhost port.
