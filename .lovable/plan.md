# Dream Fashion — Inventory Management

A bilingual (বাংলা / English) inventory + sales management app for a single shop owner. Mobile-first PWA-style design with a desktop dashboard.

## Access model
- Single owner login (email + password) via Lovable Cloud auth.
- All data is private to the owner — strict RLS so only `auth.uid()` of the owner row sees anything.
- No public/guest access.

## Core features

### 1. Products (পণ্য)
- Fields: name, product image, buy price (কেনা দাম), sell price (বিক্রয় দাম), profit (auto = sell − buy), stock quantity.
- Add / edit / delete with image upload to storage.
- Floating `+` button on mobile to add a product quickly.
- Each product card shows Buy / Sell quick-action buttons.

### 2. Cash Sale (নগদ বিক্রি)
- Pick product, qty → records sale with: product, profit, buy price, sell price, date.
- Decrements stock.

### 3. Credit Sale (বাকী বিক্রি)
- Same as cash sale + linked party (customer) + outstanding amount (বাকী টাকা).
- Records collected amount over time (টাকা আদায়).

### 4. New Purchase (নতুন ক্রয়)
- Add stock for an existing product or create a new one. Updates inventory + records cost.

### 5. Shop Expense (দোকান খরচ)
- Title, amount, date, note.

### 6. Somiti (সমিতি)
- Track samity deposits / withdrawals with date and note.

### 7. Party Collection (পার্টি কালেকশন)
- Saved parties list (name, phone).
- Per party: total owed to me (auto-summed from credit sales) minus payments received.
- Add payment → reduces outstanding balance.
- Owner withdrawal entry (মালিক টাকা নেওয়া) sits inside Party Collection ledger.

### 8. Dashboard
- Today / week / month: total cash sales, credit sales, profit, expenses, outstanding party dues, cash in hand.
- Recent activity feed.

### 9. Language toggle
- Bangla / English switch in header, persisted in localStorage. All labels translated.

## UX / Design
- Mobile-first. Bottom tab bar: Home, Products, Sales, Parties, More.
- Floating `+` FAB on Products & Sales screens.
- Clean retail aesthetic — warm neutrals with a deep emerald accent (fashion/boutique feel), Noto Sans Bengali + Inter typography pairing, soft cards, rounded-2xl.
- Light mode only for v1.

## Technical

### Stack
- TanStack Start (existing), Tailwind v4, shadcn/ui.
- Lovable Cloud (Supabase) for auth, DB, storage.
- TanStack Query for data fetching via server functions.

### Database tables (all RLS: owner-only)
- `profiles` (id, full_name)
- `products` (id, owner_id, name, image_url, buy_price, sell_price, stock, created_at)
- `parties` (id, owner_id, name, phone, created_at)
- `sales` (id, owner_id, product_id, qty, buy_price, sell_price, profit, type 'cash'|'credit', party_id nullable, paid_amount, due_amount, created_at)
- `payments` (id, owner_id, party_id, amount, note, created_at) — collections from parties
- `purchases` (id, owner_id, product_id, qty, unit_cost, total, created_at)
- `expenses` (id, owner_id, title, amount, note, created_at)
- `somiti_entries` (id, owner_id, kind 'deposit'|'withdraw', amount, note, created_at)
- `owner_withdrawals` (id, owner_id, amount, note, created_at)
- Storage bucket: `product-images` (private, owner-only).

### Routes
- `/auth` — login/signup
- `/_authenticated/` layout
  - `/` dashboard
  - `/products`, `/products/new`
  - `/sales` (tabs: cash / credit)
  - `/purchases`
  - `/expenses`
  - `/somiti`
  - `/parties`, `/parties/$id`
  - `/settings` (language, logout)

### i18n
Lightweight context + dictionary (`{ en: {...}, bn: {...} }`), `useT()` hook. No external lib needed.

## Scope for v1
Build all of the above end-to-end with seed-friendly empty states. Reports/exports and multi-user roles are out of scope.
