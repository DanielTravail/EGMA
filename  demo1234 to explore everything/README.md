# Enextrade Global Market

> Premium trading SaaS ecosystem — Signals · Academy · Copy Trading · Bot Trading · Investments · Mentorship.

A production-ready MVP front-end built with React + Vite + TypeScript + TailwindCSS + Framer Motion + Recharts. The data layer is fully abstracted so it can be swapped for **Supabase + Prisma + PostgreSQL** with minimal changes.

---

## ✨ Features

### Public site
- Premium dark fintech landing page (Binance/TradingView inspired)
- Services overview, Pricing (per-service), About, FAQ, Contact
- Legal: Terms, Privacy, Risk Disclaimer
- Authentication: Login, Register, Forgot Password (with email verification flow stub)

### Subscriber Dashboard (`/dashboard/*`)
- Dynamic sidebar that renders modules **only for active subscriptions**
- Overview with KPIs and performance analytics
- **Signal Room** — tiered access (Basic / Standard / VIP), live feed, history, win-rate analytics, locked previews
- **Academy** — modules, lessons (video / PDF / article), level gating, progress tracking
- **Copy Trading** — trader profiles, performance, simulated copy interface
- **Bot Trading** — bot subscriptions, status, performance
- **Investment Plans** — 6% monthly ROI, claim system, countdown timers, progress bars
- **Mentorship** — group & 1-on-1 sessions, booking UI
- **Subscriptions** — multi-method checkout (Paystack / Bank / Crypto), billing history
- **Notifications** — in-app inbox
- **Settings** — profile, security, preferences

### Admin Console (`/admin/*`)
- Analytics overview (revenue, users, service mix, growth)
- User management with **grant service** action
- Subscription management
- **Payment Verification Center** — approve / reject manual payments
- Signal CRUD with tier visibility & status (TP1/TP2/TP3/SL/etc.)
- Academy, Investments view
- **Broadcasts** — platform-wide notifications
- Support tickets
- Audit logs
- **Platform Settings** — bank account & crypto wallet management (admin can update payment details at any time)

---

## 🎨 Design system

| Token | Value |
|-------|-------|
| Background | `#0A0A0A` |
| Panel | `#161616` |
| Border | `#262626` |
| Brand | `#00E676` |
| Text | `#FFFFFF` |

Reusable primitives in `src/components/ui` (Button, Card, Badge, Modal, EmptyState, Logo).

---

## 🛠️ Stack

- **Frontend:** React 19, Vite, TypeScript, React Router 6, TailwindCSS 4, Framer Motion, Recharts
- **Icons:** lucide-react
- **State / Data:** lightweight typed store with localStorage persistence (`src/lib/store.ts`) — drop-in swap for Supabase
- **Auth:** `src/lib/auth.tsx` context with `login / register / logout / forgot` + `hasService(serviceKey)` permission helper. Replace internals with `supabase.auth.*` to go live.

---

## 🚀 Getting started

```bash
npm install
npm run dev
# build for production
npm run build
```

### Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@enextrade.com` | `admin123` |
| User  | `demo@enextrade.com`  | `demo1234` |

The demo user has Signals (VIP), Academy (Beginner) and Investments active so you can explore subscriber-gated modules immediately.

---

## 🔌 Wiring up Supabase (production)

The data and auth layers are intentionally isolated:

1. **`src/lib/auth.tsx`** — replace `login`, `register`, `logout`, `forgot` with `supabase.auth.signInWithPassword / signUp / signOut / resetPasswordForEmail`. Keep the `useAuth()` API stable.
2. **`src/lib/store.ts`** — swap `db.get()` / `db.set()` with Supabase queries (or generated Prisma client over a REST/Edge function).
3. **Storage** — point upload fields (proof of payment, QR codes, course PDFs) at Supabase Storage / Cloudinary / S3.
4. **Row Level Security** — enforce `service-based permissions` already mirrored client-side by `hasService()`.

---

## 📁 Folder structure

```
src/
  components/
    layout/          # PublicLayout, DashboardLayout (user + admin)
    ui/              # Button, Card, Badge, Modal, EmptyState, Logo
  lib/
    auth.tsx         # AuthProvider + useAuth
    services.ts      # SERVICES catalog + plans
    store.ts         # Mock backend (Supabase-ready)
    types.ts         # Domain types
  pages/
    public/          # Home, About, Services, Pricing, FAQ, Contact, Legal
    auth/            # Login, Register, Forgot
    dashboard/       # 10 subscriber pages
    admin/           # Admin Console
  App.tsx            # Routes + protection
  index.css          # Tailwind tokens
```

---

## 🗃 Suggested Prisma schema (production)

```prisma
model User             { id String @id @default(cuid()) email String @unique name String role Role @default(USER) ... }
model Subscription     { id String @id user User @relation(...) service Service plan String status Status startedAt DateTime expiresAt DateTime amount Decimal }
model Transaction      { id String @id user User @relation(...) service Service plan String amount Decimal method Method status TxStatus reference String proofUrl String? txHash String? createdAt DateTime approvedAt DateTime? }
model Signal           { id String @id pair String type SignalType entry Float tp1 Float tp2 Float tp3 Float sl Float tier Tier status SignalStatus analysis String chartUrl String? postedAt DateTime }
model AcademyModule    { ... lessons AcademyLesson[] }
model AcademyLesson    { ... module AcademyModule @relation(...) }
model Investment       { ... user User @relation(...) plan Plan @relation(...) }
model Plan             { ... }
model MentorshipSession{ ... }
model Notification     { ... user User? @relation(...) }
model SupportTicket    { ... }
model AuditLog         { ... }
model PaymentSettings  { ... }
```

Service-based access enforcement on every API call:
```ts
// middleware/requireService.ts
await prisma.subscription.findFirst({
  where: { userId, service, status: "active", expiresAt: { gt: new Date() } }
}) ?? throw new ForbiddenError();
```

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel — framework auto-detected (Vite)
3. Add env vars (when wired to Supabase):
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
4. Deploy. Custom domain supported in dashboard.

---

## ⚖️ Disclaimer

Trading involves risk. Past performance does not guarantee future results. This product is informational and educational.
