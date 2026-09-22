# Celestia — Premium Online Supermarket

A premium, mobile-first online supermarket for Uzbek customers, built as a real functional
application: Next.js (App Router) + TypeScript + Tailwind CSS on the frontend, Prisma + PostgreSQL
as the database layer, with a full customer storefront and a role-based admin dashboard.

Original brand identity — a navy/gold crescent-and-leaf mark, deep navy / cream / gold palette,
Fraunces + Inter typography. No layout, imagery, or branding copied from any existing supermarket.

## Getting started

You'll need a PostgreSQL connection string — a free one from [Neon](https://neon.tech) or
[Supabase](https://supabase.com) works fine, or use Vercel's Postgres storage integration if
deploying there (see **Deploying** below).

```bash
npm install             # installs deps + runs `prisma generate`
cp .env.example .env     # then fill in DATABASE_URL and AUTH_SECRET
npm run db:migrate       # applies the schema to your database
npm run db:seed          # seeds categories, products, admin users, zones, promo codes, a demo order
npm run dev               # http://localhost:3000
```

### Demo accounts

| Role | Login | Password |
| --- | --- | --- |
| Super Admin | admin@celestia.uz | Celestia2026! |
| Product Manager | products@celestia.uz | Celestia2026! |
| Order Manager | orders@celestia.uz | Celestia2026! |
| Customer | +998901234567 | customer123 |

Admin dashboard: `/admin` (redirects to `/admin/login`).

## Deploying (e.g. to Vercel)

1. Import this GitHub repo into Vercel, using the `claude/pensive-mendel-376hsi` branch (or merge
   it to your default branch first).
2. In the Vercel project → **Storage** tab, create a Postgres database (Neon-backed) — this
   automatically sets `DATABASE_URL` for the project.
3. Add an `AUTH_SECRET` environment variable (any long random string — `openssl rand -hex 32`).
4. Deploy.
5. Run `npm run db:migrate` and `npm run db:seed` once against that same `DATABASE_URL` (from your
   own machine, or have whoever set up the database run it) so the live database has its schema
   and starter catalog.

No SQLite file is involved anywhere — the same Postgres database is used in development and
production, which is what makes a one-click host like Vercel work at all (serverless platforms
don't have a persistent local disk for a SQLite file to live on).

## Architecture

- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- **Database**: PostgreSQL via Prisma ORM (`prisma/schema.prisma`) — Product, Category, Order,
  OrderItem, User, Address, WishlistItem, Cart/CartItem, AdminUser, Review, DeliveryZone,
  PickupLocation, PromoCode, Settings.
- **Auth**: separate signed httpOnly-cookie sessions for customers and admins (`jose` +
  `bcryptjs`), enforced for `/admin/*` in `src/proxy.ts` (Next's Proxy/Middleware layer) and
  per-route in API handlers via `requireAdmin()`.
- **Cart & wishlist**: client-side (Zustand + localStorage) referencing product IDs only; prices,
  stock and availability are always re-fetched from the database at render and at checkout, so an
  admin price/stock change is reflected immediately — nothing is cached stale in the cart.
- **Checkout**: delivery fee, free-delivery threshold, minimum order and promo-code discounts are
  all recomputed server-side in `POST /api/orders` (never trusted from the client) using the same
  `computeDeliveryFee`/`meetsMinOrder` helpers the UI uses for the live preview.
- **Payments**: Cash, Card, Click, Payme, Uzum Bank are selectable at checkout. No card data is
  ever collected or stored. Online methods are clearly marked as **test mode** — orders are
  created with `paymentStatus: PENDING`, and an admin (Order Manager/Super Admin) marks them Paid
  from `/admin/orders`, mirroring how a real payment-provider webhook would update the order once
  a provider is integrated.
- **Images**: product photos and category art live in `public/products`; admin-uploaded images go
  to `public/uploads` (gitignored) via `POST /api/admin/upload`. Note: on serverless hosts
  (Vercel included) this local-disk upload won't persist between deploys — swap it for a cloud
  storage bucket (S3, Vercel Blob, etc.) before relying on admin image uploads in production.
- **i18n**: the storefront is Russian by default (`src/i18n/dictionaries.ts` also carries UZ/EN
  dictionaries and the catalog's `nameRu`/`nameEn` columns for future re-enablement, but the
  language switcher is currently removed).

## Useful scripts

```bash
npm run db:migrate   # prisma migrate dev — applies schema changes
npm run db:seed       # re-seed demo data (safe to re-run, upserts)
npm run db:reset       # drop, recreate, and reapply migrations
npm run lint            # eslint
npm run build            # prisma generate + next build
```
