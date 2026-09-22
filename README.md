# Celestia — Premium Online Supermarket

A premium, mobile-first online supermarket for Uzbek customers, built as a real functional
application: Next.js (App Router) + TypeScript + Tailwind CSS on the frontend, Prisma + SQLite
as the database layer, with a full customer storefront and a role-based admin dashboard.

Original brand identity — a navy/gold crescent-and-leaf mark, deep navy / cream / gold palette,
Fraunces + Inter typography. No layout, imagery, or branding copied from any existing supermarket.

## Getting started

```bash
npm install            # installs deps + runs `prisma generate`
npm run db:migrate      # creates prisma/dev.db and applies the schema
npm run db:seed         # seeds categories, products, admin users, zones, promo codes, a demo order
npm run dev              # http://localhost:3000
```

Copy `.env.example` to `.env` first if it isn't already present (`DATABASE_URL`, `AUTH_SECRET`).

### Demo accounts

| Role | Login | Password |
| --- | --- | --- |
| Super Admin | admin@celestia.uz | Celestia2026! |
| Product Manager | products@celestia.uz | Celestia2026! |
| Order Manager | orders@celestia.uz | Celestia2026! |
| Customer | +998901234567 | customer123 |

Admin dashboard: `/admin` (redirects to `/admin/login`).

## Architecture

- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- **Database**: SQLite via Prisma ORM (`prisma/schema.prisma`) — Product, Category, Order,
  OrderItem, User, Address, WishlistItem, Cart/CartItem, AdminUser, Review, DeliveryZone,
  PickupLocation, PromoCode, Settings. Swap the `datasource` provider to Postgres/MySQL for
  production without touching application code.
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
  to `public/uploads` (gitignored) via `POST /api/admin/upload`.
- **i18n**: UZ / RU / EN dictionaries in `src/i18n/dictionaries.ts`, switched client-side and
  persisted in a cookie; product data itself is currently single-locale (Uzbek) with `nameRu`/
  `nameEn` columns reserved on `Product`/`Category` for future translation.

## Useful scripts

```bash
npm run db:migrate   # prisma migrate dev
npm run db:seed       # re-seed demo data (safe to re-run, upserts)
npm run db:reset       # drop, recreate, and reseed the database
npm run lint            # eslint
npm run build           # prisma generate + next build
```
